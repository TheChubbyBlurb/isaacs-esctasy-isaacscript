local Mod = RegisterMod("fiddleford", 1)
local sound = SFXManager()

EntityType.FIDDLEFORD = Isaac.GetEntityTypeByName("fiddleford")

FFState = {
  APPEAR = 0,
  IDLE = 1,
  PRESLIDE = 2,
  SLIDE = 3,
  TIRED = 4,
  DANCE = 5,
  SPIT = 6,
  WHISTLE = 7
}

MarkovChain {
  [FFState.IDLE] = {0.8, 0.05, 0, 0, 0.05, 0, 0.05, 0.05},
  [FFState.PRESLIDE] = {0, 0, 1, 0, 0, 0, 0, 0},
  [FFState.SLIDE] = {0, 0, 0.6, 0.4, 0, 0, 0, 0},
  [FFState.TIRED] = {0.4, 0, 0, 0.6, 0, 0, 0, 0},
  [FFState.SPIT] = {1, 0, 0, 0, 0, 0, 0, 0}
}




function MarkovTransition(State)
  local roll = math.random()
  for i = 1, #MarkovChain do
    roll = roll - MarkovChain[state][i]
    if roll <= 0 then
      return i
    end
  end
  return #MarkovChain
end


function Mod:fiddleford(entity)
  local data = entity:GetData()
  if data.State == nil then data.State = 0 end
  if data.StateFrame == nil then data.StateFrame = 0 end
  local target = entity.GetPlayerTarget()

  data.StateFrame = data.StateFrame + 1


  --Idle
  if data.State == FFState.APPEAR and entity.GetSprite():IsFinished("Appear") then
    data.State = FFState.IDLE
    data.StateFrame = 0
    -- Idle
  elseif data.State == FFState.IDLE then
    if data.StateFrame == 1 then
      entity.GetSprite():Play("Idle", true)
    elseif entity.GetSprite():IsFinished("Idle") then
      data.State = MarkovTransition(data.State)
      data.StateFrame = 0
    end
    -- PreSlide
  elseif data.State == FFState.PRESLIDE then
    if data.StateFrame == 1 then
      entity.GetSprite():Play("BeforeSlide", true)
    elseif entity.GetSprite():IsFinished("BeforeSlide") then
      data.State = MarkovTransition(data.State)
      data.StateFrame = 0
    end

    --Slide
  elseif data.State == FFState.SLIDE then
    if data.StateFrame == 1 then
      entity.GetSprite():Play("Slide", true)
      sound:Play(SoundEffect.SOUND_BOSS_GURGLE_ROAR, 1, 0, false, 1)
    elseif entity:GetSprite():IsEventTriggered("Slide") then
      entity.Velocity = (target.Position - entity.Position):Normalized() * 16
    elseif entity:GetSprite():IsFinished("Slide") then
      data.State= MarkovTransition(data.State)
      data.StateFrame = 0
    end

  --Spit
  elseif data.State == FFState.SPIT then
    if data.StateFrame == 1 then
      entity.GetSprite():Play("Spit", true)
    elseif entity.GetSprite():IsFinished("Shoot") then
      Isaac.Spawn(EntityType.ENTITY_GAPER, 2, 0,
      entity.Position + Vector(0,30) ,
    (target.Position - entity.Position):Normalized() * 16,
    entity)
      sound:Play(SoundEffect.SOUND_CUTE_GRUNT,1,0,false,1)
    elseif entity:GetSprite():IsFinished("Spit") then
      data.State= MarkovTransition(data.State)
      data.StateFrame = 0
    end

  elseif data.State == FFState.TIRED then
    entity.Velocity = entity.Velocity * 0.75
    if data.StateFrame == 1 then
      entity.GetSprite():Play("BeforeSlide", true)
    elseif entity.GetSprite():IsFinished("BeforeSlide") then
      data.State = MarkovTransition(data.State)
      data.StateFrame = 0
    end



















  end

  if entity.Velocity.X > 0 then
    entity.GetSprite().FlipX = true
  else
    entity.GetSprite().FlipX = false
  end
end

Mod:AddCallback(ModCallbacks,MC_NPC_UPDATE, Mod.fiddlefordUpdate, EntityType.FIDDLEFORD)