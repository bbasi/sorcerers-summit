// wrapper : Phaser.GameObjects.Image | Phaser.GameObjects.Sprite
// sprite -> animation
import bb from './bb'

export default (
class bb_img {
  static crt_img(scn,nme,x=0.50,y=0.50){ return new bb_img(scn,nme,x,y) }
  static crt_spr(scn,prfx,anim,frms=3){
    let anims = [{key:anim, prefix:prfx,end:frms,loop:true}]
    let img   = new bb_img(scn,`${prfx}00`,0.50,0.50,{anims:anims,rate:10});
    img.play(anim);
    return img;
  }
  constructor(scn,frame,x,y,cfg=null){
    let physics = false;
    let is_img  = true;
    if(cfg){
      physics = cfg.physics;
      is_img  = !cfg.anims;
    }
    x = bb.screen.gt_x(x);
    y = bb.screen.gt_y(y);
    let img = null;
    if(is_img)
      if(physics) img = scn.physics.add.image (x,y,'sprites',frame);
      else        img = scn        .add.image (x,y,'sprites',frame);
    else
      if(physics) img = scn.physics.add.sprite(x,y,'sprites',frame);
      else        img = scn        .add.sprite(x,y,'sprites',frame);
    img.setScale(bb.screen.scale);
    if(physics){
      img.setVelocity(0);
      img.setCollideWorldBounds(false);
      img.body.allowGravity   = false;
    }
    if(!is_img){
      cfg.anims.map(a=>crt_anim(a));
      function crt_anim(dat){
        scn.anims.create({
          key        : dat.key,
          frameRate  : cfg && cfg.rate ? cfg.rate:18,
          onComplete : dat.onComplete,
          repeat     : dat.loop == true ? -1:0,
          frames     : scn.anims.generateFrameNames('sprites',{
            prefix : dat.prefix,
            end    : dat.end,
            zeroPad: 2
          })
        });
      }
    }
    return img;
  }
}
)