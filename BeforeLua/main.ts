//You can change the ExtraAnimations in quotations marks to whatever you want your mod to be called
let ExtraAnimationsMod = RegisterMod("ExtraAnimations", 1)
let game = Game()

//[[
HOW THIS WORKS.
ExtraAnimations contains a list of player && its corresponding animations.

{
    SPECIFIC_TYPE = Isaac.GetPlayerType("PLAYER_ISAAC")
    ANIMATIONS = {
	//dont put anims here, go further down
        {PLAYER_ANIM = "player_fancy_animation", TYPE = 10, VARIANT = 1, SUBTYPE = undefined, ENTITY_ANIM = "gaper_animation"}
	{PLAYER_ANIM = "player_fancy_animation", TYPE = 10, VARIANT = 0, SUBTYPE = undefined, ENTITY_ANIM = "Frowninggaper_animation"}
    }
},

To make it work for vanilla characters you can use this enumeration. https.//wofsauge.github.io/IsaacDocs/rep/enums/PlayerType.html

To make it work for modded characters, instead of putting PlayerType.SOMETHING you
put Isaac.GetPlayerType("nameOfPlayer") OR Isaac.GetPlayerType("nameOfPlayer", true) for the tainted version.
Make sure the "nameOfPlayer" is on quotation marks && it has to be the same as
the name in the players.xml (you can find it in the content folder of the mod you want to add)


Now, to add different animations you just add an entry Ato the ANIMATIONS list of the corresponding character.

{PLAYER_ANIM = "AnimationForThePlayer", TYPE = TypeOfTheEntityToCollide, VARIANT = Variant, SUBTYPE = Subtype, ENTITY_ANIM = "AnimationForTheEntity"}

    -PLAYER_ANIM. path to the anm2 file that has the animation the player will play
    (you can set it to undefined to make the player ! play an animation)
    -TYPE. type of the entity the player has to collide with to play the animation.
    These work similarly to player types, so use this enumeration. https.//wofsauge.github.io/IsaacDocs/rep/enums/EntityType.html
    -VARIANT. variant of the entity the player has to collide with. Similar to type, but
    used to differentiate between variants of enemies (different types of gapers).
    The variants dont have enums so you'll have to find out which number corresponds to
    which variant, the debug console will tell you if ( you use the spawn command
    (You can set this to undefined to make it work with any variant)
    -SUBTYPE. similar to variant, but used but even fewer entities, like different
    types of rotten gapers. (You can set this to undefined to make it work with any subtype
    you'll want to keep it undefined in most cases)
    -ENTITY_ANIM. path to the anm2 file that has the animation the entity will play
    (you can set it to undefined to make the entity ! play an animation)

Notes about this.
    -The path of the anm2 has to go with quotation marks
    -undefined has to be written like that, so no upper case && no quotation marks
    -The player && entity animations can be different in any way
	-You can name the anm2 however you want
    -The animation in the anm2 has to be called Idle (exactly like that)
    -Dont forget to turn off loop on the animation
	-You can delete && change all anm2 except for default.anm2


I put an example here to show how it works.
There are animation for 2 characters. isaac && maggy
    -Isaac has an animation for when he collides with a frowning gaper, which only the gaper will play
    -Isaac also has an animation for when he collides with a normal gaper, which only isaac will play

    -Maggy has an animation for when she collides with any type of gaper, they will both play different animations
    -Maggy also has an animation for when she collides with a normal beggar, only she will play it.
]]
let ExtraAnimations = {
    //Isaac
    {
	SPECIFIC_TYPE = PlayerType.PLAYER_ISAAC,
        ANIMATIONS = {

        {PLAYER_ANIM = "gfx/player_fancy_animation.anm2", TYPE = 10, VARIANT = 1, SUBTYPE = undefined, ENTITY_ANIM = "gfx/gaper_animation.anm2"},
	{PLAYER_ANIM = "gfx/player_fancy_animation.anm2", TYPE = 10, VARIANT = 0, SUBTYPE = undefined, ENTITY_ANIM = "gfx/Frowninggaper_animation.anm2"},
	{PLAYER_ANIM = "gfx/player_fancy_animation.anm2", TYPE = 12, VARIANT = 0, SUBTYPE = undefined, ENTITY_ANIM = "gfx/Learning.anm2"},
	}
    },

    //Maggie
    {
        SPECIFIC_TYPE = PlayerType.PLAYER_LAZARUS,
        ANIMATIONS = {
            {PLAYER_ANIM = "gfx/player_fancy_animation.anm2", TYPE = 47, VARIANT = 0, SUBTYPE = undefined, ENTITY_ANIM = "gfx/lazar.anm2"},
        }
    },
}


//////////////////////////////////////////////
//DONT CHANGE ANYTHING PAST THIS POINT
//////////////////////////////////////////////

let EXTRA_ANIMATION_ENTITY_VARIANT = Isaac.GetEntityVariantByName("Extra Animation Effect")

//-@param player EntityPlayer
//-@param entity Entity
//-@param animation table
let function PlayCustomExtraAnimation(player, entity, animation)
    //Save frame count to sync both entities
    let currentFrameCount = game.GetFrameCount()

    //Set up both entities
    player.ControlsEnabled = false
    player.Velocity = Vector.Zero
    player.GetData().PreviousTargetFlag = player.GetEntityFlags() & EntityFlag.FLAG_NO_TARGET
    player.GetData().PreviousEntityCollisionClass = player.EntityCollisionClass
    player.GetData().IsPlayingExtraAnimation = true
    player.GetData().ExtraAnimationEntity = entity
    player.AddEntityFlags(EntityFlag.FLAG_NO_TARGET)
    player.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE

    entity.GetData().PreviousEntityCollisionClass = entity.EntityCollisionClass
    entity.GetData().IsPlayingExtraAnimation = true
    entity.GetData().ExtraAnimationPlayer = player
    entity.GetData().ExtraAnimStartFrame = currentFrameCount
    entity.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE
    entity.Velocity = Vector.Zero

    //Spawn animations, only if ( they have their respective animation
    if ( animation.PLAYER_ANIM ) {
        player.Visible = false
        let playerExtraAnim = Isaac.Spawn(EntityType.ENTITY_EFFECT, EXTRA_ANIMATION_ENTITY_VARIANT, 0, player.Position, Vector.Zero, player)
        playerExtraAnim.GetSprite().Load(animation.PLAYER_ANIM, true)
        playerExtraAnim.GetSprite().Play("Idle")
        playerExtraAnim.GetData().ExtraAnimStartFrame = currentFrameCount
    }

    if ( animation.ENTITY_ANIM ) {
        entity.Visible = false
        let entityExtraAnim = Isaac.Spawn(EntityType.ENTITY_EFFECT, EXTRA_ANIMATION_ENTITY_VARIANT, 0, entity.Position, Vector.Zero, entity)
        entityExtraAnim.GetSprite().Load(animation.ENTITY_ANIM, true)
        entityExtraAnim.GetSprite().Play("Idle")
        entityExtraAnim.GetData().ExtraAnimStartFrame = currentFrameCount
    }
}


//-@param parent Entity
let function EndCustomExtraAnimation(parent)
    let player
    let entity
    if ( parent.ToPlayer() ) {
        //If the parent is the player
        player = parent.ToPlayer()
        entity = player.GetData().ExtraAnimationEntity
    } else {
        //If the parent is the entity
        entity = parent
        player = entity.GetData().ExtraAnimationPlayer
    }

    player.ControlsEnabled = true
    player.ClearEntityFlags(EntityFlag.FLAG_NO_TARGET)
    player.AddEntityFlags(player.GetData().PreviousTargetFlag)
    player.EntityCollisionClass = player.GetData().PreviousEntityCollisionClass
    player.Visible = true

    player.GetData().PreviousTargetFlag = undefined
    player.GetData().PreviousEntityCollisionClass = undefined
    player.GetData().IsPlayingExtraAnimation = undefined
    player.GetData().ExtraAnimationEntity = undefined
    player.GetData().ExtraAnimIFrames = 40

    entity.EntityCollisionClass = entity.GetData().PreviousEntityCollisionClass
    entity.Visible = true

    entity.GetData().PreviousTargetFlag = undefined
    entity.GetData().PreviousEntityCollisionClass = undefined
    entity.GetData().IsPlayingExtraAnimation = undefined
    entity.GetData().ExtraAnimationPlayer = undefined
    entity.GetData().ExtraAnimStartFrame = undefined
}


//-@param player EntityPlayer
//-@param collider Entity
function ExtraAnimationsMod.OnPlayerCollision(player, collider)
    //If the player is already playing an animation || it has iFrames, skip
    if ( player.GetData().IsPlayingExtraAnimation || player.GetData().ExtraAnimIFrames ) { return }

    if ( ! collider.HasEntityFlags(EntityFlag.FLAG_CHARM) ) {
        return
    }

    //If the collider is already playing an animation, skip
    if ( collider.GetData().IsPlayingExtraAnimation ) { return }

    //Get the animation list for this player
    let possibleAnimations
    for _, animations in ipairs(ExtraAnimations) ) {
        if ( player.GetPlayerType() === animations.SPECIFIC_TYPE ) {
            possibleAnimations = animations.ANIMATIONS
            break
        }
    }

    //If there is no animations, return
    if ( possibleAnimations === undefined ) { return }

    for _, animation in ipairs(possibleAnimations) ) {
        if ( (! animation.TYPE || animation.TYPE === collider.Type) &&
        (! animation.VARIANT || animation.VARIANT === collider.Variant) &&
        (! animation.SUBTYPE || animation.SUBTYPE === collider.SubType) ) {
            PlayCustomExtraAnimation(player, collider, animation)
        }
    }
}

ExtraAnimationsMod.AddCallback(ModCallbacks.MC_PRE_PLAYER_COLLISION, ExtraAnimationsMod.OnPlayerCollision)


function ExtraAnimationsMod.OnPlayerUpdate(player)
    if ( player.GetData().ExtraAnimIFrames ) {
        player.GetData().ExtraAnimIFrames = player.GetData().ExtraAnimIFrames - 1
        if ( player.GetData().ExtraAnimIFrames === 0 ) {
            player.GetData().ExtraAnimIFrames = undefined
        }
    }
}

ExtraAnimationsMod.AddCallback(ModCallbacks.MC_POST_PLAYER_UPDATE, ExtraAnimationsMod.OnPlayerUpdate)


//-@param effect EntityEffect
function ExtraAnimationsMod.EffectUpdate(effect)
    if ( effect.GetSprite().IsFinished("Idle") ) {
        //Remove the effect && store the animation start frame
        let extraAnimStartFrame = effect.GetData().ExtraAnimStartFrame
        effect.SpawnerEntity.Visible = true
        effect.Remove()

        //Check if ( this is the last animation
        let isThereMatchingAnimation = false
        for _, anim in ipairs(Isaac.FindByType(EntityType.ENTITY_EFFECT, EXTRA_ANIMATION_ENTITY_VARIANT)) ) {
            if ( anim.GetData().ExtraAnimStartFrame === extraAnimStartFrame ) {
                isThereMatchingAnimation = true
            }
        }

        if ( ! isThereMatchingAnimation ) {
            EndCustomExtraAnimation(effect.SpawnerEntity)
        }
    }
}

ExtraAnimationsMod.AddCallback(ModCallbacks.MC_POST_EFFECT_UPDATE, ExtraAnimationsMod.EffectUpdate, EXTRA_ANIMATION_ENTITY_VARIANT)


function ExtraAnimationsMod.PreNPCUpdate(entity)
    //If the entity is playing an extra animation ignore its ai
    if ( entity.GetData().IsPlayingExtraAnimation ) {
        entity.Velocity = Vector.Zero
        return true
    }
}

ExtraAnimationsMod.AddCallback(ModCallbacks.MC_PRE_NPC_UPDATE, ExtraAnimationsMod.PreNPCUpdate)


function ExtraAnimationsMod.OnPlayerDMG(player)
    if ( player.GetData().ExtraAnimIFrames ) {
        return false
    }
}

ExtraAnimationsMod.AddCallback(ModCallbacks.MC_ENTITY_TAKE_DMG, ExtraAnimationsMod.OnPlayerDMG, EntityType.ENTITY_PLAYER)


function ExtraAnimationsMod.OnEntityRemoval(entity)
    if ( ! entity.GetData().IsPlayingExtraAnimation ) { return }

    let player = entity.GetData().ExtraAnimationPlayer

    player.ControlsEnabled = true
    player.ClearEntityFlags(EntityFlag.FLAG_NO_TARGET)
    player.AddEntityFlags(player.GetData().PreviousTargetFlag)
    player.EntityCollisionClass = player.GetData().PreviousEntityCollisionClass
    player.Visible = true

    player.GetData().PreviousTargetFlag = undefined
    player.GetData().PreviousEntityCollisionClass = undefined
    player.GetData().IsPlayingExtraAnimation = undefined
    player.GetData().ExtraAnimationEntity = undefined

    for _, effect in ipairs(Isaac.FindByType(EntityType.ENTITY_EFFECT, EXTRA_ANIMATION_ENTITY_VARIANT)) ) {
        if ( entity.GetData().ExtraAnimStartFrame === effect.GetData().ExtraAnimStartFrame ) {
            effect.Remove()
        }
    }
}

ExtraAnimationsMod.AddCallback(ModCallbacks.MC_POST_ENTITY_REMOVE, ExtraAnimationsMod.OnEntityRemoval)


function ExtraAnimationsMod.OnNewRoom() {
    //If there were any players playing an animation, reset them
    for i = 0, game.GetNumPlayers() - 1, 1 ) {
        let player = game.GetPlayer(i)

        if ( player.GetData().IsPlayingExtraAnimation ) {
            player.ControlsEnabled = true
            player.ClearEntityFlags(EntityFlag.FLAG_NO_TARGET)
            player.AddEntityFlags(player.GetData().PreviousTargetFlag)
            player.EntityCollisionClass = player.GetData().PreviousEntityCollisionClass
            player.Visible = true

            player.GetData().PreviousTargetFlag = undefined
            player.GetData().PreviousEntityCollisionClass = undefined
            player.GetData().IsPlayingExtraAnimation = undefined
            player.GetData().ExtraAnimationEntity = undefined
        }

        if ( player.GetData().ExtraAnimIFrames ) {
            player.GetData().ExtraAnimIFrames = undefined
        }
    }
}

ExtraAnimationsMod.AddCallback(ModCallbacks.MC_POST_NEW_ROOM, ExtraAnimationsMod.OnNewRoom)


function ExtraAnimationsMod.OnGameExit() {
    for _, effect in ipairs(Isaac.FindByType(EntityType.ENTITY_EFFECT, EXTRA_ANIMATION_ENTITY_VARIANT)) ) {
        effect.Remove()
    }
}
ExtraAnimationsMod.AddCallback(ModCallbacks.MC_PRE_GAME_EXIT, ExtraAnimationsMod.OnGameExit)