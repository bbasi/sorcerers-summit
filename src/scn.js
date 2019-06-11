import Phaser from 'phaser'
import bb     from './bb'
import bb_img from './bb_img'

class scn extends Phaser.Scene {
  constructor(nme){
    super(`scn-${nme}`);
    this.twn = new twn(this);
  }
}
export class scn_boot extends scn {
  constructor(){ super('boot') }
  preload(){
    this.load.multiatlas('sprites','./assets/sprites.json','assets');
    this.load.audio('music',[
      './assets/audio/music/music.mp3',
      './assets/audio/music/music.ogg',
    ]);
    this.load.audioSprite('sfx','./assets/audio/sfx/audiosprite.json',[
      './assets/audio/sfx/audiosprite.mp3',
      './assets/audio/sfx/audiosprite.ogg',
    ]);
    let bar = this.add.graphics();
    let pct = 0.0;
    this.load.on('progress',p=>{
      if(p > pct) pct = p;
      bar.clear();
      bar.fillStyle(0xB10DC9, 1);
      let ht = bb.screen.height - 10;
      let wd = pct * bb.screen.width;
      bar.fillRect(0, ht, wd, 10);
    });
    this.load.on('complete',()=>{
      bar.destroy();
      this.cameras.main.setBackgroundColor('#9D8AB6');
    });
  }
  create(){
    bb.audio.init(this);
    this.scene.launch('scn-bkgd');
  }
}
export class scn_bkgd extends scn {
  constructor(){ super('bkgd') }
  create(){
    bb_img.crt_img(this,'bckgd/sky');
    bb_img.crt_img(this,'bckgd/sky');
    bb_img.crt_img(this,'bckgd/stars');
    bb_img.crt_img(this,'bckgd/clouds_2');
    bb_img.crt_img(this,'bckgd/moon');
    bb_img.crt_img(this,'bckgd/planet');
    bb_img.crt_img(this,'bckgd/clouds_1');

    if(this.sys.game.device.os.desktop){
      bb_img.crt_spr(this,'bckgd/anim/island/','idle-island',12);
      bb_img.crt_img(this,'bckgd/mountains_2');
      bb_img.crt_spr(this,'bckgd/anim/mist_4/','idle-mist4' ,15);
      bb_img.crt_img(this,'bckgd/mountains_1');
      bb_img.crt_spr(this,'bckgd/anim/mist_3/' ,'idle-mist3',15);
      bb_img.crt_spr(this,'bckgd/anim/tower_2/','idle-twr2' , 7);
      bb_img.crt_spr(this,'bckgd/anim/mist_2/' ,'idle-mist2',15);
      bb_img.crt_spr(this,'bckgd/anim/tower_1/','idle-twr1' , 7);
      bb_img.crt_spr(this,'bckgd/anim/mist_1/' ,'idle-mist1',15);
    }
    else{
      bb_img.crt_spr(this,'bckgd/anim/island_basic/','idle-island-basic',4);
      bb_img.crt_img(this,'bckgd/mountains_2');
      bb_img.crt_img(this,'bckgd/mist_4');
      bb_img.crt_img(this,'bckgd/mountains_1');
      bb_img.crt_img(this,'bckgd/mist_3');
      bb_img.crt_spr(this,'bckgd/anim/tower_2_basic/','idle-twr2-basic',4);
      bb_img.crt_img(this,'bckgd/mist_2');      
      bb_img.crt_spr(this,'bckgd/anim/tower_1_basic/','idle-twr1-basic',4);
      bb_img.crt_img(this,'bckgd/mist_1');
    }
    
    bb_img.crt_img(this,'bckgd/bridge');
    bb.camera.rgstr(this.cameras.main);
    this.scene.launch('scn-game');
  }
}
export class scn_game extends scn {
  constructor(){ super('game') }
  create(){
    bb.world.init(this);
    bb.camera.rgstr(this.cameras.main);
    setTimeout(()=>{
      bb.game.init();
    },1000)
    this.scene.launch('scn-ui');
  }
  update(time, delta){ bb.world.upd(delta/100); }
}
export class scn_ui extends scn {
  constructor(){ super('ui') }
  create(){ bb.ui.init(this) }
}


class twn {
  constructor(scn){
    this.scn = scn;
  }
  alpha(trg,a,dur,dly=0,ese='linear'){
    return this.scn.tweens.add({
        targets : trg,
        alpha   :  a,
        delay   : dly,
        duration: dur,
        ease    : ese,
    });
  }
  x(trg,x,dur,dly,ese='linear',cb_fin=null,cb_str=null){
    return this.scn.tweens.add({
         targets: trg,
               x: x,
        duration: dur,
           delay: dly,
            ease: ese,
         onStart: ()=>{if(cb_str)cb_str()},
      onComplete: ()=>{if(cb_fin)cb_fin()}
    });
  }
  y(trg,y,dur,dly,ese='linear',cb_fin=null){
    return this.scn.tweens.add({
         targets: trg,
               y: y,
        duration: dur,
           delay: dly,
            ease: ese,
      onComplete: ()=>{if(cb_fin)cb_fin()}
    });
  }
  rate(snd,to,dur){
    let dat = { rte : snd.currentConfig.rate };
    return this.scn.tweens.add({
         targets: dat,
             rte: to,
        duration: dur,
            ease: 'linear',
        onUpdate: ()=>{snd.setRate(dat.rte)}
    });
  }
  volume(snd,to,dur){
    let dat = { vlm : snd.currentConfig.volume };
    return this.scn.tweens.add({
         targets: dat,
             vlm: to,
        duration: dur,
            ease: 'linear',
        onUpdate: ()=>{snd.setVolume(dat.vlm)}
    });
  }
}