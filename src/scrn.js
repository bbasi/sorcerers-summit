import bb from './bb'
import {
  ui_btn,
  ui_btn_tgl,
  ui_img,
  ui_txt
} from './ui_elm'

class scrn {
  constructor(scn){ this.scn = scn }
  crt_btn    (scn,frame,x,y,cb)   { return new ui_btn    (scn,frame,x,y,cb)    }
  crt_btn_tgl(scn,frame,x,y,cb)   { return new ui_btn_tgl(scn,frame,x,y,cb)    }
  crt_img    (scn,frame,x,y)      { return new ui_img    (scn,frame,x,y)       }
  crt_txt    (scn,text,x,y,sz,cfg){ return new ui_txt    (scn,text,x,y,sz,cfg) }
  show()  {}
  hide(cb){}
  st_live(lv=true){}
}
export class scrn_home extends scrn {
  constructor(scn){
    super(scn);
    this.img_ttl = this.crt_img(scn,'title'      ,0.50,0.17);
    this.btn_ply = this.crt_btn(scn,'btn/play'   ,0.50,0.77,()=>{this.btn_ply.fd(0,300,150);bb.game.ply_cls();});
    this.btn_opt = this.crt_btn(scn,'btn/options',0.50,0.88,()=>{this.btn_opt.fd(0,300,150);bb.ui.to_optn();  });
    this.frst    = true;
  }
  show(){
    this.img_ttl.fd(1    ,this.frst ?  800:600);
    this.btn_ply.fd(1,600,this.frst ? 1800:700);
    this.btn_opt.fd(1,600,this.frst ? 2200:800);
    setTimeout(()=>{this.st_live()},this.frst ? 3000:1400);
    this.frst = false;
  }
  hide(cb){
    this.img_ttl.fd(0,600,500);
    this.btn_ply.fd(0,300);
    this.btn_opt.fd(0,300);
    setTimeout(()=>{
      cb();
      this.btn_ply.rfrsh();
      this.btn_opt.rfrsh();
    },1000);
  }
  st_live(lv=true){
    this.btn_ply.st_live(lv);
    this.btn_opt.st_live(lv);
  }
}
export class scrn_optn extends scrn {
  constructor(scn){
    super(scn);
    this.txt_bal = this.crt_txt    (scn,'Balraj Basi'    ,0.50,0.10,18);
    this.txt_jus = this.crt_txt    (scn,'Justin Nichols' ,0.50,0.17,18);
    this.txt_dop = this.crt_txt    (scn,'Dopecreature'   ,0.50,0.24,18);
    this.btn_sfx = this.crt_btn_tgl(scn,'btn/sfx'  ,0.35,0.35,()=>{bb.io.tgl('sfx');bb.audio.sfx.rfrsh();});
    this.btn_msc = this.crt_btn_tgl(scn,'btn/music',0.65,0.35,()=>{bb.io.tgl('msc');bb.audio.msc.rfrsh();});
    this.txt_vrs = this.crt_txt    (scn,'1.1.0'          ,0.50,0.45,15);
    this.btn_hme = this.crt_btn    (scn,'btn/home' ,0.50,0.88,()=>{this.btn_hme.fd(0,300,150);bb.ui.to_home();});
  }
  show(){
    this.btn_msc.rfrsh(bb.io.gt('msc'));
    this.btn_sfx.rfrsh(bb.io.gt('sfx'));
    this.txt_bal.fd(1,1000);
    this.txt_jus.fd(1,1000,100);
    this.txt_dop.fd(1,1000,200);
    this.btn_sfx.fd(1,1000,300);
    this.btn_msc.fd(1,1000,400);
    this.txt_vrs.fd(1,1000,500);
    this.btn_hme.fd(1,1000,600);
    setTimeout(()=>{
      this.st_live();
    },1800);
  }
  hide(cb){
    this.txt_vrs.fd(0, 300,100);
    this.btn_sfx.fd(0, 300,200);
    this.btn_msc.fd(0, 300,200);
    this.txt_bal.fd(0, 300,400);
    this.txt_jus.fd(0, 300,400);
    this.txt_dop.fd(0, 300,400);
    setTimeout(()=>{
      cb();
      this.btn_hme.rfrsh();
    },600);
  }
  st_live(lv=true){
    this.btn_hme.st_live(lv);
    this.btn_sfx.st_live(lv);
    this.btn_msc.st_live(lv);
  }
}
export class scrn_game extends scrn {
  constructor(scn){
    super(scn);
    this.txt_scr = this.crt_txt(scn,'0',0.03,0.07,24,{align:'l'});
    bb.events.lstn('score-increase',scr=>{ this.txt_scr.st_txt(scr) });
  }
  show(){
    this.txt_scr.fd(1,700);
  }
  hide(cb=null){
    this.txt_scr.fd(0,400);
    setTimeout(()=>{
      this.txt_scr.st_txt('0');
      cb();
    },600);
  }
}
export class scrn_post extends scrn {
  constructor(scn){
    super(scn);
    this.txt_scr = this.crt_txt(scn,'0',0.50,0.22,110);
    this.btn_ply = this.crt_btn(scn,'btn/play',0.50,0.77,()=>{this.btn_ply.fd(0,300,150);bb.game.ply_cls();});
    this.btn_hme = this.crt_btn(scn,'btn/home',0.50,0.88,()=>{this.btn_hme.fd(0,300,150);bb.ui.to_home();  });
    bb.events.lstn('game-over',scr=>{
                   let sz = 110;
           if(scr>999) sz =  75;
      else if(scr> 99) sz = 100;
      this.txt_scr.st_txt(scr,sz);
    });
  }
  show(){
    this.txt_scr.fd(1,700);
    this.btn_ply.fd(1,300,1000);
    this.btn_hme.fd(1,300,1100);
    setTimeout(()=>{
      this.st_live();
    },1300);
  }
  hide(cb=null){
    this.txt_scr.fd(0,400,400);
    this.btn_ply.fd(0,300);
    this.btn_hme.fd(0,300);
    setTimeout(()=>{
      cb();
      this.btn_ply.rfrsh();
      this.btn_hme.rfrsh();
    },600);
  }
  st_live(lv=true){
    this.btn_ply.st_live(lv);
    this.btn_hme.st_live(lv);
  }
}