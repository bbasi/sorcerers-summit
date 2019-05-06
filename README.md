# Sorcerers Summit BB
**V 1.1.0**

## credits
[Balraj Basi](http://www.balrajbasi.com)\
[Justin Nichols](http://agamedesigner.com)\
[dopecreature](https://soundcloud.com/dopecreature)

<br>

## main
```javascript
// package.json
"start": "webpack-dev-server ... webpack.dev.js"
"build": "webpack            ... webpack.prd.js"

npm install

npm start
npm run build
```

<br>

## .js
### _idx
```javascript
function boot (){
  function ld_font                  (){}
  function ld_game                  (){}
}
```
### bb_img
```javascript
+ class bb_img {
  static function crt_img           (){}
  static function crt_spr           (){}
  // crt_anim()
}
```
### bb
```javascript
class events
{
  function lstn                     (){}
  function trgr                     (){}
}

let _rnd;

class util
{
  function shfl_                    (){}
  function shfl                     (){}
  function rnd_b                    (){}
  function rnd_f                    (){}
  function rnd_i                    (){}
  function rnd                      (){}
}

class io
{
  function ld                       (){}
  function sv                       (){}
  function gt                       (){}
  function tgl                      (){}
  function gt_tut                   (){}
  function st_tut                   (){}
  function st_scr_cls               (){}
}

class screen
{
  function gt_x                     (){}
  function gt_y                     (){}
}

class camera
{
  function twn                      (){}
  function rgstr                    (){}
}

class world 
{
  function init                     (){}
  function upd                      (){}
  function gt_arw                   (){}
  function gt_enm                   (){}
  function gt_hnd                   (){}
}
class pool { 
  function gt                       (){} 
}

class game
{
  function init                     (){}
  function main                     (){}
  function ply_tut                  (){}
  function ply_cls                  (){}
}

class ui
{
  function init                     (){}
  function to_home                  (){}
  function to_optn                  (){}
  function to_game                  (){}
  function to_post                  (){}
  function to                       (){}
}

class audio
{
  function init                     (){}
}
class music {
  function st_tut                   (){}
  function st_mnu                   (){}
  function st_gme                   (){}
  function st_off                   (){}
  function rte                      (){}
  function vlm                      (){}
  function rfrsh                    (){}
}
class sfx {
  function ply_arw                  (){}
  function ply_dth                  (){}
  function ply_btn                  (){}
  function ply_sld                  (){}
  function ply_ovr                  (){}
  function ply                      (){}
  function rfrsh                    (){}
  function heli                     (){}
    // enm_evt()
    // upd_vol()
}

class spwnr
{
  function hrz                      (){}
  function vrt                      (){}
  function tut                      (){}
}
class grid {
  function gt_x_col                 (){}
  function gt_y_row                 (){}
}
class rtr {
  function gt_hrz                   (){}
  function gt_vrt                   (){}
  function gt_tut                   (){}
}
class mxr_rw { 
  function gt                       (){}
}
class mxr_cl { 
  function gt                       (){}
}

let _bb = null;

class bb {}
+ new bb()
```
### gm
```javascript
class gm {
  function strt                     (){}
  function stop                     (){}
  function on_enemy_death           (){}
  function on_enemy_route_finish    (){}
}
+ class gm_tutorial {}
+ class gm_classic  {}

class classic_diff {
  function strt                     (){}
  function upd_lvl                  (){}
  function on_enemy_spawn           (){}
  function gt_hrz                   (){}
  function gt_vrt                   (){}
}
class classic_ai {
  function strt                     (){}
  function gt_dly                   (){}
  function wv_nxt                   (){}
  function wvs_shfl                 (){}
  function on_enemy_death           (){}
  function on_enemy_route_finish    (){}
}
class wv {
  function strt                     (){}
  function stop                     (){}
  function on_stop                  (){}
  function on_enemy_death           (){}
  function on_enemy_route_finish    (){}
  function enemy_death              (){}
  function enemy_route_finish       (){}
  function spwn_hrz                 (){}
  function spwn_vrt                 (){}
  function on_spwn                  (){}
  function cmplt                    (){}
  function on_cmplt                 (){}
}
class wv_hrz_0 {}
class wv_hrz_1 {}
class wv_vrt_0 {}
class wv_vrt_1 {}
```
### gp
```javascript
class gp {
  function init                     (){}
  function enb                      (){}
  function on_enb                   (){}
  function dsb                      (){}
  function on_dsb                   (){}
  function upd                      (){}
  function on_upd                   (){}
  function st_live                  (){}
  function st_clldr                 (){}
  function on_cllsn                 (){}
  function st_alpha                 (){}
  function ply                      (){}
  function on_anim_fin              (){}
}

+ class gp_hand  {}
+ class gp_arrow { function fire    (){} }
+ class gp_enemy {
  function st_route_tut             (){}
  function st_route_hrz             (){}
  function st_route_vrt             (){}
}

let wzrd = null;

+ class gp_wizard {}
class attk { function cnjr          (){} }
class ghst { function slde          (){} }
class inpt { function on_inpt       (){} }
class slde {
  function atk                      (){}
  function bsc                      (){}
  function twn                      (){}
}
```
### scn
```javascript
class scn extends Phaser.Scene {
  function preload                  (){}
  function create                   (){}
  function update                   (){}
}
+ class scn_boot {}
+ class scn_bckd {}
+ class scn_game {}
+ class scn_ui   {}
  class twn {
    function  alpha                 (){}
    function      x                 (){}
    function      y                 (){}
    function   rate                 (){}
    function volume                 (){}
  }
```
### scrn
```javascript
class scrn {
  function crt_btn                  (){}
  function crt_btn_tgl              (){}
  function crt_img                  (){}
  function crt_txt                  (){}
  function show                     (){}
  function hide                     (){}
  function st_live                  (){}
}
+ class scrn_home {}
+ class scrn_optn {}
+ class scrn_game {}
+ class scrn_post {}
```
### ui_elm
```javascript
class ui_elm {
  function fd                       (){}
  function st_live                  (){}
  function st_txtr                  (){}
}
+ class ui_btn     { function rfrsh (){} }
+ class ui_btn_tgl { function rfrsh (){} }
+ class ui_img     {}
+ class ui_txt {
  function st_txt                   (){}
  function st_sz                    (){}
}
```