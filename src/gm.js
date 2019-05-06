import bb from './bb'

class gm {
  constructor(){ this.lv = false }
  strt(){}
  stop(){}
  on_enemy_death(){}
  on_enemy_route_finish(){}
}

export class gm_tutorial extends gm {
  constructor(){
    super();
    this.gp_hnd = null;
  }
  strt(){
    bb.spwnr.tut();
    bb.audio.msc.st_tut();
    setTimeout(()=>{
      if(!this.gp_hnd) this.gp_hnd = bb.world.gt_hnd();
      bb.events.trgr('game-start');
    },4000);
  }
  on_enemy_death(){
    this.gp_hnd.dsb();
    bb.events.trgr('game-over',-1);
    bb.io.st_tut();
    setTimeout(()=>{bb.ui.to_home()},1000);
  }
}

export class gm_classic extends gm {
  constructor(){
    super();
    this.scr = -1;
    this.ai  = new classic_ai();
  }
  strt(){
    this.lv  = true;
    this.scr = 0;
    this.ai.strt();
    bb.audio.msc.st_gme();
    bb.events.trgr('game-start');
  }
  on_enemy_death(){
    if(!this.lv) return;
    this.ai.on_enemy_death();
    bb.events.trgr('score-increase',++this.scr);
  }
  on_enemy_route_finish(){
    if(!this.lv) return;
    this.lv = false;
    this.ai.on_enemy_route_finish();
    bb.events.trgr('game-over',this.scr);
    bb.io.st_scr_cls(this.scr);
    setTimeout(()=>{
      bb.ui.to_post();
    },1000);
    bb.audio.sfx.ply_ovr();
  }
}
class classic_diff {
  constructor(){
    this.max  = 7-1;
    this.lvl  =  -1;
    this.spwn =  -1;
  }
  strt(){
    this.lvl  = -1;
    this.spwn =  0;
  }
  upd_lvl(){
    let lvl = 0;
    if     (this.spwn >= 40) lvl = 6;
    else if(this.spwn >= 30) lvl = 5;
    else if(this.spwn >= 24) lvl = 4;
    else if(this.spwn >= 16) lvl = 3;
    else if(this.spwn >= 10) lvl = 2;
    else if(this.spwn >=  5) lvl = 1;
    if(lvl != this.lvl) this.lvl = lvl;
  }
  on_enemy_spwn(){
    this.spwn++;
  }
  gt_hrz(){
    let dur = -1;
    switch(this.lvl){
      case 0 : dur = 2000; break;
      case 1 : dur = 1800; break;
      case 2 : dur = 1700; break;
      case 3 : dur = 1600; break;
      case 4 : dur = 1500; break;
      case 5 : dur = 1400; break;
      case 6 : dur = 1300; break;
    }
    return {dur};
  }
  gt_vrt(){
    let row = -1;
    if(this.lvl <= 1 ) row = bb.util.rnd_i(2,3);
    else               row = bb.util.rnd_i(1,2);
    let dur_dn =  600; // rw 3
    let dly    = 1200;
    let dur_up =  800;
    if(row == 2){
      dur_dn = dur_up = 500;
      switch(this.lvl){
        case 0 : dly = 999; break;
        case 1 : dly = 800; break;
        case 2 : dly = 700; break;
        case 3 : dly = 600; break;
        case 4 : dly = 500; break;
        case 5 : dly = 400; break;
        case 6 : dly = 400; break;
      }
    }
    if(row == 1){
      dur_dn = dur_up = 400;
      switch(this.lvl){
        case 0 : dly = 999; break;
        case 1 : dly = 800; break;
        case 2 : dly = 700; break;
        case 3 : dly = 600; break;
        case 4 : dly = 500; break;
        case 5 : dly = 400; break;
        case 6 : dly = 400; break;
      }
    }
    return {row,dur_dn,dly,dur_up};
  }
}
class classic_ai {
  constructor(){
    this.diff     = new classic_diff();
    this.wv_hrz_0 = new wv_hrz_0();
    this.wv_hrz_1 = new wv_hrz_1();
    this.wv_vrt_0 = new wv_vrt_0();
    this.wv_vrt_1 = new wv_vrt_1();
    this.wv_lv    = null;
    this.wvs      = [this.wv_hrz_0,this.wv_vrt_1,this.wv_hrz_1,this.wv_vrt_0];
    this.idx      = -1;
  }
  strt(){
    this.wvs_shfl();
    this.diff.strt();
    let on_wv_fin = ()=>{setTimeout(()=>{ this.wv_nxt(on_wv_fin) },this.gt_dly())};
    this.wv_nxt(on_wv_fin);
  }
  gt_dly(){
    switch(this.diff.lvl){
      case 0: return 0;
      case 1: return bb.util.rnd_i(100,300);
      case 2: return bb.util.rnd_i(100,300);
      case 3: return bb.util.rnd_i(200,400);
      case 4: return bb.util.rnd_i(300,500);
      case 5: return bb.util.rnd_i(500,800);
      case 6: return bb.util.rnd_i(500,800);
    }
  }
  wv_nxt(cb_fin){
    this.diff.upd_lvl();
    if(++this.idx == this.wvs.length){
      this.idx = 0;
      this.wvs_shfl();
    }
    this.wv_lv = this.wvs[this.idx];
    this.wv_lv.strt(cb_fin,this.diff);
  }
  wvs_shfl(){
    let tmp = bb.util.shfl_(this.wvs);
    if(tmp[1] == this.wvs[this.wvs.length-1])
      tmp = bb.util.shfl_(this.wvs);
    this.wvs = tmp;
  }
  on_enemy_death(){
    if(this.wv_lv) this.wv_lv.on_enemy_death();
  }
  on_enemy_route_finish(){
    if(this.wv_lv){
      this.wv_lv.on_enemy_route_finish();
      this.wv_lv.stop();
      this.wv_lv = null;
    }
  }
}
class wv {
  constructor(){
    this.enm_ttl  = -1;
    this.enm_spwn = -1;
    this.enm_lv   = -1;
    this.cb_fin   = null;
    this.diff     = null;
    this.wait     = null;
    this.hrz_dir  =  0; // -1 0 1
  }
  strt(cb,diff){
    this.cb_fin   = cb;
    this.diff     = diff;
    this.wait     = null;
    this.enm_ttl  = -1;
    this.enm_spwn =  0;
    this.enm_lv   =  0;
    this.hrz_dir  =  0;
  }
  stop(){
    this.cb_fin = null;
    if(this.wait) clearInterval(this.wait);
    this.on_stop();
  }
  on_stop(){
  }
  on_enemy_death(){
    this.enm_lv--;
    if(!this.wait) this.enemy_death();
  }
  on_enemy_route_finish(){
    this.enm_lv--;
    if(!this.wait) this.enemy_route_finish();
  }
  enemy_death(){
  }
  enemy_route_finish(){
  }
  spwn_hrz(){
    let lft = this.hrz_dir == 1;
        lft = this.hrz_dir == 0 ? bb.util.rnd_b():lft;
    bb.spwnr.hrz(this.diff,lft);
    this.on_spwn();
  }
  spwn_vrt(){
    bb.spwnr.vrt(this.diff);
    this.on_spwn();
  }
  on_spwn(){
    this.enm_spwn++;
    this.enm_lv++;
    if(this.enm_spwn == this.enm_ttl) this.cmplt();
    this.diff.on_enemy_spwn();
  }
  cmplt(){
    this.on_cmplt();
    this.wait = setInterval(()=>{
      if(this.enm_lv == 0){        
        clearTimeout(this.wait);
        this.cb_fin();
      }},100);
  }
  on_cmplt(){
  }
}
class wv_hrz_0 extends wv {
  strt(cb_fin,diff){
    super.strt(cb_fin,diff);
    let min = -1;
    let max = -1;
    switch(diff.lvl){
      case 0: this.enm_ttl = bb.util.rnd_i( 2, 3); min=800; max=999; break;
      case 1: this.enm_ttl = bb.util.rnd_i( 2, 3); min=700; max=800; break;
      case 2: this.enm_ttl = bb.util.rnd_i( 3, 5); min=600; max=800; break;
      case 3: this.enm_ttl = bb.util.rnd_i( 5, 7); min=600; max=700; break;
      case 4: this.enm_ttl = bb.util.rnd_i( 6,10); min=550; max=600; break;
      case 5: this.enm_ttl = bb.util.rnd_i( 8,14); min=500; max=550; break;
      case 6: this.enm_ttl = bb.util.rnd_i(10,20); min=475; max=500; break;
    }
    let dly = bb.util.rnd_i(min,max);
    this.hrz_dir = bb.util.rnd_b() ? +1:-1;
    this.lgc = setInterval(()=>{
      this.spwn_hrz();
      dly = bb.util.rnd_i(min,max);
    },dly);
  }
  on_stop() { clearInterval(this.lgc) }
  on_cmplt(){ clearInterval(this.lgc) }
}
class wv_hrz_1 extends wv {
  strt(cb_fin,diff){
    super.strt(cb_fin, diff);
    this.hrz_dir = 0;
    switch(diff.lvl){
      case 0: this.enm_ttl = bb.util.rnd_i(2,3); break;
      case 1: this.enm_ttl = bb.util.rnd_i(2,3); break;
      case 2: this.enm_ttl = bb.util.rnd_i(2,4); break;
      case 3: this.enm_ttl = bb.util.rnd_i(3,4); break;
      case 4: this.enm_ttl = bb.util.rnd_i(3,5); break;
      case 5: this.enm_ttl = bb.util.rnd_i(3,5); break;
      case 6: this.enm_ttl = bb.util.rnd_i(3,5); break;
    }
    this.spwn_hrz()
  }
  enemy_death(){ this.spwn_hrz() }
}
class wv_vrt_0 extends wv {
  strt(cb_fin,diff){
    super.strt(cb_fin, diff);
    let dly = -1;
    switch(diff.lvl){
      case 0: this.enm_ttl = bb.util.rnd_i(2, 3); dly=1100; break;
      case 1: this.enm_ttl = bb.util.rnd_i(2, 3); dly=1000; break;
      case 2: this.enm_ttl = bb.util.rnd_i(3, 4); dly= 900; break;
      case 3: this.enm_ttl = bb.util.rnd_i(3, 5); dly= 800; break;
      case 4: this.enm_ttl = bb.util.rnd_i(4, 8); dly= 800; break;
      case 5: this.enm_ttl = bb.util.rnd_i(5,10); dly= 800; break;
      case 6: this.enm_ttl = bb.util.rnd_i(6,12); dly= 800; break;
    }
    this.lgc = setInterval(()=>{ this.spwn_vrt() },dly);
  }
  on_stop() { clearInterval(this.lgc) }
  on_cmplt(){ clearInterval(this.lgc) }
}
class wv_vrt_1 extends wv {
  strt(cb_fin,diff){
    super.strt(cb_fin,diff);
    switch(diff.lvl){
      case 0: this.enm_ttl = bb.util.rnd_i(2,3); break;
      case 1: this.enm_ttl = bb.util.rnd_i(2,3); break;
      case 2: this.enm_ttl = bb.util.rnd_i(2,4); break;
      case 3: this.enm_ttl = bb.util.rnd_i(3,4); break;
      case 4: this.enm_ttl = bb.util.rnd_i(3,5); break;
      case 5: this.enm_ttl = bb.util.rnd_i(3,5); break;
      case 6: this.enm_ttl = bb.util.rnd_i(4,5); break;
    }
    this.spwn_vrt()
  }
  enemy_death(){ this.spwn_vrt() }
}