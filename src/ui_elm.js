import bb from './bb'

class ui_elm {
  constructor(scn){
    this.scn = scn;
    this.elm = null;
  }
  fd(to,dur=0,dly=0){
    if(dur==0) this.elm.setAlpha(to);
    else       this.scn.twn.alpha(this.elm,to,dur,dly);
  }
  st_live(lv=true){
    if(lv) this.elm.    setInteractive();
    else   this.elm.disableInteractive();
  }
  st_txtr(txtr){
    this.elm.setTexture('sprites',txtr);
  }
}
export class ui_btn extends ui_elm {
  constructor(scn,frame,x,y,cb){
    super(scn);
    this.frame_up = `${frame}/00`;
    this.frame_dn = `${frame}/01`;
    x = bb.screen.gt_x(x);
    y = bb.screen.gt_y(y);
    this.img = scn.add.image(x,y,'sprites',this.frame_up);
    this.img.setScale(bb.screen.scale);
    this.elm = this.img;
    this.st_live(false);
    this.fd(0);
    this.img.on('pointerdown',()=>{
      cb();
      this.st_live(false);
      this.st_txtr(this.frame_dn);
      bb.audio.sfx.ply_btn();
    });
  }
  rfrsh(){
    this.st_txtr(this.frame_up);
  }
}
export class ui_btn_tgl extends ui_elm {
  constructor(scn,frame,x,y,cb){
    super(scn);
    this.frame_up = `${frame}/00`;
    this.frame_dn = `${frame}/01`;
    x = bb.screen.gt_x(x);
    y = bb.screen.gt_y(y);
    this.img = scn.add.image(x,y,'sprites',this.frame_up);
    this.img.setScale(bb.screen.scale);
    this.elm = this.img;
    this.fd(0);
    this.is_dn = false;
    this.rfrsh(this.is_dn);
    this.img.on('pointerdown',()=>{
      cb();
      this.rfrsh(!this.is_dn);
      bb.audio.sfx.ply_btn();
    });
  }
  rfrsh(dn){
    this.st_txtr(dn?this.frame_dn:this.frame_up);
    this.is_dn = dn;
  }
}
export class ui_img extends ui_elm {
  constructor(scn,frame,x,y){
    super(scn);
    x = bb.screen.gt_x(x);
    y = bb.screen.gt_y(y);
    this.img = scn.add.image(x,y,'sprites',frame);
    this.img.setScale(bb.screen.scale);
    this.elm = this.img;
    this.fd(0);
    return this;
  }
}
export class ui_txt extends ui_elm {
  constructor(scn,txt,x,y,size,cfg=null){
    super(scn);
    x = bb.screen.gt_x(x);
    y = bb.screen.gt_y(y);
    this.text = scn.add.text(x,y,txt);
    this.text.setOrigin(0.50,0.50);
    this.st_sz(size);
    this.text.setColor('white');
    this.text.setFontFamily('TannenbergFett');
    this.text.setShadow(2,2,'black',3);
    this.elm = this.text;
    this.fd(0);
    if(cfg){
      if(cfg.align){
        if(cfg.align=='l') this.text.setOrigin(0.0,0.5);
        if(cfg.align=='c') this.text.setOrigin(0.5,0.5);
        if(cfg.align=='r') this.text.setOrigin(1.0,0.5);
      }
      if(cfg.color) this.text.setColor(cfg.color);
    }
    return this;
  }
  st_txt(txt,sz=0){
    this.text.setText(txt);
    if(sz > 0) this.st_sz(sz);
  }
  st_sz(sz){
    this.text.setFontSize(sz*(Math.max(bb.screen.scale_res,1))); 
  }
}