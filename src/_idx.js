import Phaser from 'phaser'
import bb     from './bb.js'
import {
  scn_boot,
  scn_bkgd,
  scn_game,
  scn_ui
} from './scn'

function boot(){
  function ld_font(){
    new FontFace('TannenbergFett','url(./assets/TannenbergFett.ttf)')
    .load()
    .then (fnt=>{document.fonts.add(fnt);ld_game();})
    .catch(err=>{ld_game()});
  }
  function ld_game(){
    let cfg = {
      parent  : 'game',
      type    : Phaser.AUTO,
      width   : bb.screen.width,
      height  : bb.screen.height,
      scene   : [scn_boot,scn_bkgd,scn_game,scn_ui],
      fps     : {min:30,target:60},
      physics : {default:'arcade',arcade:{gravity:{y:300},debug:false}},
      pixelArt: true,
      backgroundColor:'#111111',
      title  : 'Sorcerers Summit',
      version: '1.1.0',
      gameURL: 'http://www.balrajbasi.com',
      banner : {background:['#BC6FE3'],text:'#F9B900'}
    };
    new Phaser.Game(cfg);
    document.getElementById('game').style.width=`${bb.screen.width}px`;
  }
  ld_font();
}
boot();