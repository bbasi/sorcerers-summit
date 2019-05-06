import bb     from './bb'
import bb_img from './bb_img'

class gp {
  constructor(id,scn,x,y){
    this.scn = scn;
    this.img = null;
    this.x_  = bb.screen.gt_x(x);
    this.y_  = bb.screen.gt_y(y);
    this.nme = `gp-${id}`;
    this.st_live(false);
  }
  init(frame,anims,anim,physics=null){
    this.img   = new bb_img(this.scn,frame,0.50,0.50,{anims:anims,physics:physics != null});
    this.img.x = this.x_;
    this.img.y = this.y_;
    this.img.on('animationcomplete',(anim,frame)=>{this.on_anim_fin(anim.key)},this);
    this.anim_dfl = anim;
    this.ply(anim);
    if(physics){
      this.img.setSize(physics.size.x,physics.size.y,true);
      this.img.body.offset.x = physics.offset.x;
      this.img.body.offset.y = physics.offset.y;
      this.st_clldr(false);
    }
  }
  enb(){
    this.img.visible = true;
    this.on_enb();
  }
  on_enb(){
  }
  dsb(){
    this.img.x = this.x_;
    this.img.y = this.y_;
    this.img.visible = false;
    this.st_live(false);
    this.st_alpha(1);
    this.ply(this.anim_dfl);
    this.on_dsb();
  }
  on_dsb(){
  }
  upd(dlt){
    if(this.lv) this.on_upd(dlt);
  }
  on_upd(dlt){
  }
  st_live(lv=true){
    this.lv = lv;
  }
  st_clldr(lv=true){
    this.img.body.enable = lv;
  }
  on_cllsn(gp){
  }
  st_alpha(a,dur=0){
    if(dur == 0) this.img.setAlpha(a);
    else         this.scn.twn.alpha(this.img,a,dur,0,'Power4');
  }
  ply(anim){
    this.img.play(anim);
  }
  on_anim_fin(anim){
  }
}

export class gp_hand extends gp {
  constructor(scn){
    super(`hand`,scn,0.90,0.62);
    let anims = [
      {key:'tutorial-hand'  ,prefix:'tutorial/hand/'  ,end: 5,loop:true},
      {key:'tutorial-cursor',prefix:'tutorial/cursor/',end: 5,loop:true}
    ];
    let anim = scn.sys.game.device.input.touch ? 'tutorial-hand' : 'tutorial-cursor';
    this.init('tutorial/hand/00',anims,anim);
    this.img.setDepth(-1);
    this.dsb();
  }
  on_enb(){
    this.st_alpha(0);
    this.st_alpha(1,2000);
  }
}

export class gp_arrow extends gp {
  constructor(scn,x,y,idx){
    super(`arrow-${idx}`,scn,x,y);
    let anims = [
      {key:'projectile-idle'   ,prefix:'prjctle/idle/'   ,end: 5,loop:true },
      {key:'projectile-explode',prefix:'prjctle/explode/',end: 4,loop:false}
    ];
    this.init('prjctle/idle/00',anims,'projectile-idle',{size:{x:10,y:18},offset:{x:27.5,y:8}});
  }
  on_enb(){
    this.st_clldr();
  }
  on_dsb(){
    this.st_clldr(false);
  }
  on_upd(dlt){
    let spd = (dlt * bb.screen.height) * this.vlcty;
    let acl = (dlt * bb.screen.height) * 0.0001;
    this.img.y -= spd;
    this.vlcty += acl;
    if(this.img.y < -20 ) this.dsb();
  }
  fire(x){
    this.vlcty = 0.35;
    this.img.x = x;
    this.img.y = wzrd.img.y;
    this.st_live();
    bb.audio.sfx.ply_arw();
  }
}

export class gp_enemy extends gp {
  constructor(scn,x,y,idx){
    super(`enemy-${idx}`,scn,x,y);
    let anims = [
      {key:'enemy-a-idle'   ,prefix:'enmy/a/idle/'   ,end: 11,loop:true},
      {key:'enemy-a-death'  ,prefix:'enmy/a/death/'  ,end:  0},
      {key:'enemy-a-death-1',prefix:'enmy/a/death_1/',end: 11},
      {key:'enemy-a-death-2',prefix:'enmy/a/death_2/',end:  5}
    ];
    this.init('enmy/a/idle/00',anims,'enemy-a-idle',{size:{x:36,y:30},offset:{x:46.5,y:53.0}});
    this.rt  = null;
    this.vis = false;
  }
  on_enb(){
    this.st_alpha(0.6);
    this.vis = false;
  }
  on_dsb(){
    this.st_clldr(false);
    this.vis = false;
  }
  on_upd(){
    if(!this.vis){
      let ybuf = 0.90;
      let xbuf = 0.05;
      let in_y = ((this.img.getBounds().height * (1.0-ybuf)) - this.img.y) < 0;
      let x1   = bb.screen.width * xbuf;
      let x2   = bb.screen.width * (1-xbuf);
      let in_x = this.img.x > x1 && this.img.x < x2;
      if(in_y && in_x){
        this.vis = true;
        this.st_clldr();
        this.st_alpha(1,314);
      }
    }
  }
  on_cllsn(gp){
    this.st_clldr(false);
    this.st_live(false);
    if(this.rt) this.rt.stop();
    this.ply('enemy-a-death-1');
    bb.events.trgr('enemy-death');
    bb.audio.sfx.ply_dth();
  }
  on_anim_fin(anim){
    if(anim == 'enemy-a-death-1') this.dsb();
  }
  st_route_tut(dat){
    this.img.x = dat.x1;
    this.img.y = dat.y1;
    this.rt    = this.scn.twn.y(this.img,dat.y2,dat.dur_dn,0);
    this.st_live();
  }
  st_route_hrz(dat){
    this.img.x = dat.x1;
    this.img.y = dat.y1;
        let cb = ()=>{ bb.events.trgr('enemy-route-finish'); this.dsb(); }
       this.rt = this.scn.twn.x(this.img,dat.x2,dat.dur,0,'linear',cb);
    this.st_live();
  }
  st_route_vrt(dat){
    this.img.x = dat.x1;
    this.img.y = dat.y1;
      let cb_1 = ()=>{ this.rt = this.scn.twn.y(this.img,dat.y1,dat.dur_up,dat.dly,'linear',cb_2) };
      let cb_2 = ()=>{ bb.events.trgr('enemy-route-finish'); this.dsb(); }
       this.rt = this.scn.twn.y(this.img,dat.y2,dat.dur_dn,0,'linear',cb_1);
    this.st_live();
  }
}

let wzrd = null;

export class gp_wizard extends gp {
  constructor(scn){
    super('wizard',scn,0.50,0.62);
    wzrd = this;
    let anims = [
      {key: 'wizard-idle'   ,prefix: 'char/idle/'   ,end: 9,loop: true},
      {key: 'wizard-punch-l',prefix: 'char/punch_l/',end: 8},
      {key: 'wizard-punch-r',prefix: 'char/punch_r/',end: 7},
      {key: 'wizard-slide-l',prefix: 'char/slide_l/',end: 0},
      {key: 'wizard-slide-r',prefix: 'char/slide_r/',end: 0}
    ];
    this.init('char/idle/00',anims,'wizard-idle');
    this.st_live();
    this.img_shdw = bb_img.crt_img(scn,'char/shadow/00',0.50,0.62);
    this.img_shdw.alpha = 0.60;
    this._attk = new attk();
    this._ghst = new ghst();
    this._inpt = new inpt();
    this._slde = new slde();
    // over-fade
    bb.events.lstn('game-over',()=>{
      wzrd.st_alpha(0.75,150);
      setTimeout(()=>{wzrd.st_alpha(1.0,200)},1000);
    })
    // slide-in
    wzrd.img.x = bb.util.rnd_b() ? bb.screen.gt_x(-0.20):bb.screen.gt_x(1.20);
    setTimeout(()=>{wzrd._slde.bsc()},2000);
  }
  on_upd(dlt){
    this.img_shdw.alpha = this.img.alpha - (1.0-0.60);
    this.img_shdw.x     = this.img.x;
  }
  on_anim_fin(anim){
    if(anim == 'wizard-punch-r' || anim == 'wizard-punch-l') this.ply('wizard-idle');
  }
}
class attk {
  constructor(){ this.lft = bb.util.rnd_b() }
  cnjr(){
    if(this.lft) wzrd.ply('wizard-punch-l');
    else         wzrd.ply('wizard-punch-r');
    this.lft = bb.util.rnd() < 0.90 ? !this.lft:this.lft;
    bb.world.gt_arw().fire(wzrd.img.x);
  }
}
class ghst {
  constructor(){
    this.img = bb_img.crt_img(wzrd.scn,'char/slide_l/00',0.50,0.62);
    this.img.alpha = 0;
    this.img.setDepth(-1);
  }
  slde(x,dur){
    if(x > wzrd.img.x) this.img.setTexture('sprites','char/slide_r/00');
    else               this.img.setTexture('sprites','char/slide_l/00');
    this.img.x = wzrd.img.x;
    this.img.alpha = 0.60;
    wzrd.scn.twn.x(this.img,x,Math.pow(dur,1.23),0,'Power3',
      ()=>{this.img.visible= false},()=>{this.img.visible = true});
  }
}
class inpt {
  constructor(){
    wzrd.scn.input.on('pointerdown', pntr => this.on_inpt(pntr), wzrd.scn);
    this.lv    = true;
    this.lv_gm = false;
    bb.events.lstn('game-start',()=>{ this.lv_gm =  true });
    bb.events.lstn('game-over' ,()=>{ this.lv_gm = false });
  }
  on_inpt(p) {
    if(!this.lv || !this.lv_gm) return;
    this.lv = false;
    wzrd._slde.atk(p.x);
    setTimeout(()=>{ this.lv = true },200);
  }
}
class slde {
  constructor(){
    bb.events.lstn('game-over',()=>{
      setTimeout(()=>{ this.bsc() },1000);
    })
  }
  atk(x){
    let dlt = Math.abs(x-wzrd.img.x);
    let pct = dlt/bb.screen.width;
    if(pct < 0.10){
      wzrd.img.x = x;
      wzrd._attk.cnjr();
    }
    else{
      let dur = 200*pct;
      this.twn(x,dur,()=>{ wzrd._attk.cnjr() });
      wzrd._ghst.slde(x,dur);
      bb.audio.sfx.ply_sld(pct<0.40);
    }
  }
  bsc(){
    let x   = bb.screen.gt_x(0.50);
    let dlt = Math.abs(x-wzrd.img.x);
    let pct = dlt/bb.screen.width;
    let dur = 150;
    let anm = false;
    if(pct > 0.10){
      anm = true;
      dur = Math.pow(dur, 1.3);
      bb.audio.sfx.ply_sld(pct<0.40);
    }
    this.twn(x,dur,()=>{ wzrd.ply('wizard-idle') },anm);
  }
  twn(x,dur,cb,anim=true){
    if(anim)
      if(x > wzrd.img.x) wzrd.ply('wizard-slide-r');
      else               wzrd.ply('wizard-slide-l');
    wzrd.scn.twn.x(wzrd.img,x,dur,0,'Power4',cb);
  }
}