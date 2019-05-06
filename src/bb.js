import Phaser from 'phaser'

class events {
  constructor()     { this.emitter = new Phaser.Events.EventEmitter() }
  lstn(evt,cb)      { this.emitter.on  (evt,cb,this) }
  trgr(evt,dat=null){ this.emitter.emit(evt,dat)     }
}

let _rnd = new Phaser.Math.RandomDataGenerator();

class util {
  shfl_(a){
    let lst = a[a.length-1]; let tmp = [];
    do{tmp = this.shfl(a)} while(tmp[0] == lst)
    return tmp;
  }
  shfl(a)   { return _rnd.shuffle(a)       }
  rnd_b()   { return _rnd.frac() > 0.50    }
  rnd_f(a,b){ return _rnd.realInRange(a,b) }
  rnd_i(a,b){ return _rnd.between(a,b)     }
  rnd()     { return _rnd.frac()           }
}

class io {
  constructor(){
    this.dat = {tut:0,sfx:1,msc:1,scr_cls:0};
    this.key = 'ssm_svfl';
    this.ld();
  }
  ld(){
    if(!localStorage.getItem(this.key))
        this.sv();
    this.dat = JSON.parse(localStorage.getItem(this.key));
  }
  sv(){
    localStorage.setItem(this.key,JSON.stringify(this.dat));
  }
  gt(key){
    if(key=='msc') return this.dat.msc == 1;
    if(key=='sfx') return this.dat.sfx == 1;
  }
  tgl(key){
    if(key=='msc') this.dat.msc==1 ? this.dat.msc=0:this.dat.msc=1;
    if(key=='sfx') this.dat.sfx==1 ? this.dat.sfx=0:this.dat.sfx=1;
    this.sv();
  }
  gt_tut(){ return this.dat.tut == 1;    }
  st_tut(){ this.dat.tut = 1; this.sv(); }
  st_scr_cls(scr){if(scr>this.dat.scr_cls){this.dat.scr_cls=scr; this.sv();}}
}

class screen {
// base-res-art : 256.0 x 341.0, base-res : 187.5 x 250.0
  constructor(){
    this.height = -1.0;
    this.width  = -1.0;
    for(let i=0; i<window.innerHeight; i++){
      this.height = i;
      this.width  = this.height * 0.75;
      if(this.width > window.innerWidth) break;
    }
    this.height *= 0.90;
    this.width  *= 0.90;
    this.rect   = new Phaser.Geom.Rectangle(0,0,this.width,this.height);
    this.scale     = this.height / 341.0;
    this.scale_res = this.height / 250.0;
  }
  gt_x(x){ return this.rect.width  * x }
  gt_y(y){ return this.rect.height * y }
}

class camera {
  constructor(){
    this.cams = [];
    this.y_mn = -50;
    let  y_gm =   0;
    _bb.events.lstn('game-play',()=>{this.twn(     y_gm,1200)});
    _bb.events.lstn('game-over',()=>{this.twn(this.y_mn,1000)});
  }
  twn(to,dly){ this.cams.map(cam => {cam.scene.twn.y(cam,to,1200,dly,'Power1')}) }
  rgstr(cam){
    cam.zoom *= 1.01;  // seam - top
    cam.height -=0.25; // seam - bot
    this.cams.push(cam);
    cam.y = this.y_mn;
  }
}

import {
  gp_wizard,
  gp_enemy,
  gp_arrow,
  gp_hand
} from './gp';

class world {
  constructor(){
    this.gps = [];
  }
  init(scn){
    let wizard  = new gp_wizard(scn);
    let enemies = [];
    for(let i=0; i<10; i++) enemies.push(new gp_enemy(scn,[1.10+(0.20*i)],0.30,i));
    let arrows = [];
    for(let i=0; i<3; i++){
      let arrow  = new gp_arrow(scn,[1.10+(0.20*i)],0.85,i);
      arrows.push(arrow);
      for(let j=0; j<enemies.length; j++){
        scn.physics.add.collider(arrow.img,enemies[j].img,(a,b)=>{
               arrow.on_cllsn(enemies[j]);
          enemies[j].on_cllsn(arrow);
        });
      }
    }
    this.gps.push(wizard);
    for(let i=0; i<enemies.length; i++) this.gps.push(enemies[i]);
    for(let i=0; i<arrows .length; i++) this.gps.push( arrows[i]);
    this.pl_arw  = new pool( arrows);
    this.pl_enm  = new pool(enemies);
    this.gp_hand = new gp_hand(scn);
  }
  upd(dlt){
    for(let i=0; i<this.gps.length; i++) this.gps[i].upd(dlt);
  }
  gt_arw(){ return this.pl_arw.gt() }
  gt_enm(){ return this.pl_enm.gt() }
  gt_hnd(){ this.gp_hand.enb(); return this.gp_hand; }
}
class pool {
  constructor(gps){
    this.pl  = gps;
    this.idx = -1;
    for(let i=0; i<this.pl.length; i++) this.pl[i].dsb();
  }
  gt(){
    if(++this.idx == this.pl.length) this.idx = 0;
    let gp = this.pl[this.idx];
    gp.enb();
    return gp;
  }
}

import {
  gm_tutorial,
  gm_classic 
} from './gm'

class game {
  constructor(){
    this.gm_tut = new gm_tutorial();
    this.gm_cls = new gm_classic();
    this.gm_lv  = null;
  }
  init(){
    _bb.events.lstn('enemy-death',       ()=>{ if(this.gm_lv) this.gm_lv.on_enemy_death()        });
    _bb.events.lstn('enemy-route-finish',()=>{ if(this.gm_lv) this.gm_lv.on_enemy_route_finish() });
    this.main();
  }
  main(){
    let tut = !_bb.io.gt_tut();
    if (tut) setTimeout(()=>{this.ply_tut()},4000);
    else{ _bb.audio.msc.st_mnu(); _bb.ui.to_home(); }
  }
  ply_tut(){
    _bb.events.trgr('game-play');
    this.gm_lv = this.gm_tut;
    this.gm_lv.strt();
  }
  ply_cls(){
    _bb.events.trgr('game-play');
    _bb.ui.to_game();
    setTimeout(()=>{
      this.gm_lv = this.gm_cls;
      this.gm_lv.strt();
    },2500);
  }
}

import {
  scrn_home,
  scrn_optn,
  scrn_game,
  scrn_post
} from './scrn'

class ui {
  init(scn){
    this.scn = scn;
    this._home = new scrn_home(scn);
    this._optn = new scrn_optn(scn);
    this._game = new scrn_game(scn);
    this._post = new scrn_post(scn);
    this.scrn_lve = null;
  }
  to_home(){ this.to(this._home) }
  to_optn(){ this.to(this._optn) }
  to_game(){ this.to(this._game) }
  to_post(){ this.to(this._post) }
  to(scrn){
    if(this.scrn_lve){
      this.scrn_lve.st_live(false);
      setTimeout(()=>{
        this.scrn_lve.hide(()=>{
          this.scrn_lve = scrn;
          scrn.show();
        });
      },314);
    }
    else{
      this.scrn_lve = scrn;
      scrn.show();
    }
  }
}

class audio {
  init(scn){
    this.scn = scn;
    this.msc = new msc(scn);
    this.sfx = new sfx(scn);
  }
}
class msc {
  constructor(scn){
    this.scn = scn;
    this.lv  = _bb.io.gt('msc');
    this.snd = this.scn.sound.add('music')
    this.snd.setVolume(0.00);
    this.snd.setRate  (0.95);
    this.snd.play({loop:true});
    _bb.events.lstn('game-over',()=>{ this.st_mnu() });
  }
  st_tut(){
    this.vlm(0.05,5000);
  }
  st_mnu(){
    if(!this.lv) return;
    this.rte(0.95, 314);
    this.vlm(0.20,3000);
  }
  st_gme(){
    if(!this.lv) return;
    this.rte(1.00, 314);
    this.vlm(0.30,3000);
  }
  st_off(){
    this.rte(0.95,1000);
    this.vlm(0.00,1000);
  }
  rte(to,dur){
    this.scn.twn.rate  (this.snd,to,dur);
  }
  vlm(to,dur){
    this.scn.twn.volume(this.snd,to,dur);
  }
  rfrsh(){
    this.lv = _bb.io.gt('msc');
    let vlm = this.lv ? 0.20:0.00;
    this.vlm(vlm,300);
  }
}
class sfx {
  constructor(scn){
    this.scn = scn;
    this.lv  = _bb.io.gt('sfx');
    this.heli();
  }
  ply_arw(){
    let rte = _bb.util.rnd_f(0.90,1.00);
    let vlm = _bb.util.rnd_f(0.10,0.15);
    this.ply({sfx:'lazer',rte,vlm});
  }
  ply_dth(){
    this.ply({sfx:'death',rte:0.80,vlm:0.25});
  }
  ply_btn(){
    this.ply({sfx:'btn1',vlm:0.30});
  }
  ply_sld(shrt=true){
    if(shrt)this.ply({sfx:'slide_short',vlm:0.15});
    else    this.ply({sfx:'slide_long' ,vlm:0.18});
  }
  ply_ovr(){
    this.ply({sfx:'over1',vlm:0.80});
  }
  ply(cfg){
    if(!this.lv) return;
    let opt = {
      volume: cfg.vlm ? cfg.vlm:0.15,
      rate  : cfg.rte ? cfg.rte:1.00,
      loop  : cfg.lp  ? cfg.lp :false
    }
    this.scn.sound.playAudioSprite('sfx',cfg.sfx,opt);
  }
  rfrsh(){
    this.lv = _bb.io.gt('sfx');
  }
  heli(){
    this.scn.sound.playAudioSprite('sfx','helicopter',{volume:0.00,rate:0.90,loop:true});
    let snd    = this.scn.sound.sounds[1];//msc,heli
    let lv_hli = false;
    let cnt_e  = -1; 
    _bb.events.lstn('game-play',         ()=>{ if(this.lv) lv_hli=true; cnt_e=0;     });
    _bb.events.lstn('game-over',         ()=>{ cnt_e=0; upd_vol(3000); lv_hli=false; });
    _bb.events.lstn('enemy-spawn',       ()=>{ enm_evt(+1)} );
    _bb.events.lstn('enemy-death',       ()=>{ enm_evt(-1)} );
    _bb.events.lstn('enemy-route-finish',()=>{ enm_evt(-1)} );
    function enm_evt(n){ if(!lv_hli) return; cnt_e += n; upd_vol();       }
    function upd_vol() { if(!lv_hli) return; snd.setVolume(cnt_e * 0.04); }
  }
}

class spwnr {
  constructor(){
    this.rtr    = new rtr();
    this.mxr_rw = new mxr_rw();
    this.mxr_cl = new mxr_cl();
  }
  hrz(diff,lft=true){
    let e   = _bb.world.gt_enm();
    let row = this.mxr_rw.gt();
    let dat = this.rtr.gt_hrz(e,row,diff,lft);
        e.st_route_hrz(dat);
    _bb.events.trgr('enemy-spawn');
  }
  vrt(diff){
    let e   = _bb.world.gt_enm();
    let col = this.mxr_cl.gt();
    let dat = this.rtr.gt_vrt(e,col,diff);
        e.st_route_vrt(dat);
    _bb.events.trgr('enemy-spawn');
  }
  tut(){
    let e   = _bb.world.gt_enm();
    let dat = this.rtr.gt_tut(e);
        e.st_route_tut(dat);
    _bb.events.trgr('enemy-spawn');
  }
}
// 0||1 2 3 4 5||6
// 1
// 2
// 3
class grid {
  gt_x_col(gp,col){
    switch(col){
      case 0: return _bb.screen.gt_x(0) - (gp.img.getBounds().width * 0.25);
      case 1: return _bb.screen.gt_x(0.10);
      case 2: return _bb.screen.gt_x(0.30);
      case 3: return _bb.screen.gt_x(0.50);
      case 4: return _bb.screen.gt_x(0.70);
      case 5: return _bb.screen.gt_x(0.90);
      case 6: return _bb.screen.gt_x(1) + (gp.img.getBounds().width * 0.25);
    }
  }
  gt_y_row(gp,row){
    switch(row){
      case 0: return _bb.screen.gt_y(0) - (gp.img.getBounds().height * 0.25);
      case 1: return _bb.screen.gt_y(0.10);
      case 2: return _bb.screen.gt_y(0.20);
      case 3: return _bb.screen.gt_y(0.30);
    }
  }
}
class rtr {
  constructor(){
    this.grid = new grid();
  }
  gt_hrz(gp,row,diff,lft=true){
    let x1    = this.grid.gt_x_col(gp,0);
    let x2    = this.grid.gt_x_col(gp,6);
    let y1    = this.grid.gt_y_row(gp,row);
    let {dur} = diff.gt_hrz();
    if(!lft) x1 = x2 + (x2=x1, 0)
    return {x1,x2,y1,dur};
  }
  gt_vrt(gp,col,diff){
    let {row,dur_dn,dly,dur_up} = diff.gt_vrt();
    let x1 = this.grid.gt_x_col(gp,col);
    let y1 = this.grid.gt_y_row(gp, 0 );
    let y2 = this.grid.gt_y_row(gp,row);
    return {x1,y1,dur_dn,y2,dly,dur_up};
  }
  gt_tut(gp){
    let dur_dn = 2000;
    let x1     = this.grid.gt_x_col(gp,5);
    let y1     = this.grid.gt_y_row(gp,0);
    let y2     = this.grid.gt_y_row(gp,3);
    return {x1,y1,dur_dn,y2};
  }
}
class mxr_rw {
  constructor(){
    this.rws = [1,2,3];
    this.idx = 0;
    _bb.util.shfl(this.rws);
  }
  gt(){
    if(this.idx == this.rws.length){
      _bb.util.shfl_(this.rws);
      this.idx = 0;
    }
    return this.rws[this.idx++];
  }
}
class mxr_cl {
  constructor(){
    this.cls = [1,2,3,4,5];
    this.idx = 0;
    _bb.util.shfl(this.cls);
  }
  gt(){
    if(this.idx == this.cls.length){
      let _1 = this.cls.splice(0,2);
      let _2 = this.cls.splice(0,3);
          _1 = _bb.util.shfl (_1);
          _2 = _bb.util.shfl_(_2);
      this.cls.push(_1[0],_1[1],_2[0],_2[1],_2[2]);
      this.idx = 0;
    }
    return this.cls[this.idx++];
  }
}

let _bb = null;

class bb {
  constructor(){
    _bb = this;
    this.events = new events();
    this.util   = new util  ();
    this.io     = new io    ();
    this.screen = new screen();
    this.camera = new camera();
    this.world  = new world ();
    this.game   = new game  ();
    this.ui     = new ui    ();
    this.audio  = new audio ();
    this.spwnr  = new spwnr ();
  }
}
export default new bb();