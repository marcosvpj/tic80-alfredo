// title:   Castle Prototype
// author:  game developer, email, etc.
// desc:    short description
// site:    website link
// license: MIT License (change this to your license of choice)
// version: 0.1
// script:  js

let t=0

const gravity=.7

const TILE_FLAG_OPEN=0
const TILE_FLAG_WALKABLE=1
const TILE_FLAG_STAIRS=2
const TILE_FLAG_SOLID=3

function can_walk(e,vx,vy) {
	let bounderies=e.bounderies()
	for (const k in bounderies) {
		if (vx!=0&&!can_pass(bounderies[k].x+vx,bounderies[k].y)) return false
		if (vy>0&&!can_pass(bounderies[k].x,bounderies[k].y+vy)) return false
		if (vy<0&&!is_stair(bounderies[k].x,bounderies[k].y+vy)) return false
	}
	return true
}
function can_pass(x,y){
	let tx=Math.floor(x/8)
	let ty=Math.floor(y/8)
	if(tx<0||ty<0) return false
	return fget(mget(tx,ty), TILE_FLAG_OPEN)
	// return (mget(tx,ty)>=0&&mget(tx,ty)<=31)
}
function is_stair(x,y){
	let tiles=[16,18,19]
	let tx=Math.floor(x/8)
	let ty=Math.floor(y/8)
	// return tiles.includes(mget(tx,ty))||tiles.includes(mget(tx,ty+1))
	return fget(mget(tx,ty), TILE_FLAG_STAIRS)
}


function can_move_x(pos){
	return fget(mget(pos.x,pos.y), TILE_FLAG_WALKABLE)
		||(fget(mget(pos.p.x,pos.p.y), TILE_FLAG_SOLID)&&fget(mget(pos.x,pos.y), TILE_FLAG_OPEN))
		||(fget(mget(pos.p.x,pos.p.y), TILE_FLAG_STAIRS)&&fget(mget(pos.x,pos.y), TILE_FLAG_OPEN))
		// ||(fget(mget(pos.p.x,pos.p.y), TILE_FLAG_STAIRS)&&fget(mget(pos.x,pos.y), TILE_FLAG_OPEN))
		// ||(fget(mget(pos.p.x,pos.p.y), TILE_FLAG_STAIRS)&&fget(mget(pos.x,pos.y), TILE_FLAG_OPEN))
		||(fget(mget(pos.p.x,pos.p.y+1), TILE_FLAG_SOLID)&&fget(mget(pos.x,pos.y), TILE_FLAG_OPEN))
		// ||(fget(mget(pos.x+1,pos.y+1), TILE_FLAG_SOLID)&&fget(mget(pos.x,pos.y), TILE_FLAG_OPEN))
		// ||(fget(mget(pos.x-1,pos.y+1), TILE_FLAG_SOLID)&&fget(mget(pos.x,pos.y), TILE_FLAG_OPEN))
		// ||(fget(mget(pos.x,pos.y-1),   TILE_FLAG_OPEN)&&fget(mget(pos.x,pos.y), TILE_FLAG_OPEN))
		||(fget(mget(pos.p.x,pos.p.y),TILE_FLAG_OPEN)&&fget(mget(pos.x,pos.y),TILE_FLAG_OPEN)&&pos.y==pos.p.y+1&&pos.x==pos.p.x-1)
		||(fget(mget(pos.p.x,pos.p.y),TILE_FLAG_OPEN)&&fget(mget(pos.x,pos.y),TILE_FLAG_OPEN)&&pos.y==pos.p.y+1&&pos.x==pos.p.x+1)
	
}
function can_move_y(pos){
	return fget(mget(pos.x,pos.y), TILE_FLAG_STAIRS)
	||(fget(mget(pos.x,pos.y-1),TILE_FLAG_OPEN)&&fget(mget(pos.x,pos.y),TILE_FLAG_OPEN)&&pos.y==pos.p.y+1&&pos.x==pos.p.x)
}
let queue=[]
var visited=[]
// let it=10
function read_tile(pos){
	return mget(pos.x,pos.y);
}
function check_next_pos(pos,it,f,target_pos){
	let x=Math.floor(pos.x)
	let y=Math.floor(pos.y)
	if(visited.includes("x"+x+"y"+y)) return;
	// if (!can_pass(pos.x*8,pos.y*8)) return;
	if(f!=undefined && !f(pos)) return; 

	visited.push("x"+x+"y"+y)
	print(it,xtot(pos.x*8),xtot(pos.y*8),1,true,true,true)
	if(x==target_pos.x&&y==target_pos.y) {
		print(it,xtot(pos.x*8),xtot(pos.y*8),12,true,true,true)
		let previous = pos.p
		while (!!previous) {
			print(it,xtot(previous.x*8),xtot(previous.y*8),12,true,true,true)		
			previous = previous.p
		}
		// if(!!pos.p) print(it,xtot(pos.p.x*8),xtot(pos.p.y*8),12,true,true,true)
		// if(!!pos.p.p) print(it,xtot(pos.p.p.x*8),xtot(pos.p.p.y*8),12,true,true,true)
		
	}
	if(it>120) return;
	it++
	
	check_next_pos({x:pos.x,y:pos.y+1,p:pos},it,can_move_y,target_pos)
	check_next_pos({x:pos.x,y:pos.y-1,p:pos},it,can_move_y,target_pos)
	check_next_pos({x:pos.x-1,y:pos.y,p:pos},it,can_move_x,target_pos)
	check_next_pos({x:pos.x+1,y:pos.y,p:pos},it,can_move_x,target_pos)
}

function xtot(x) {
	return Math.floor(x/8)*8
}
function path_to(e, tx, ty){
	let it=0
	visited=[]
	// rect(xtot(e.x),xtot(e.y),4,4,4)
	// rect(tx*8,ty*8,8,8,12)

	let start_pos={x:Math.floor(e.x/8),y:Math.floor(e.y/8)}
	let target_pos={x:tx,y:ty}

	let last_pos=start_pos

	check_next_pos(last_pos,0,undefined, target_pos)
}

function pathfinder(){
	m=mouse()
	let tx=Math.floor(m[0]/8)
	let ty=Math.floor(m[1]/8)
	path_to(Player, tx,ty)
}

let Player={
	x:120,y:30,
	vx:0,vy:0,
	speed:.5,
	tx(){return Math.floor(this.x/8)},
	ty(){return Math.floor(this.y/8)},
	flip:0,
	bounderies(){return [{x:this.x,y:this.y},{x:this.x+1,y:this.y},{x:this.x+1,y:this.y-6},{x:this.x,y:this.y-6}]},
	update(){
		if(btn(0)) Player.vy=this.speed*-1
		else if(btn(1)) Player.vy=this.speed
		else Player.vy=0
		this.flip=-1
		
		if(btn(2)){
		 Player.vx=this.speed*-1
			this.flip=1
		}	else if(btn(3)){
		 Player.vx=this.speed
			this.flip=0
		}	else Player.vx=0

		if(!is_stair(this.x,this.y)){
			this.vy+=gravity
		}

		if(can_walk(this, this.vx, 0)){this.x+=this.vx}
		if(can_walk(this, 0, this.vy)){this.y+=this.vy}
	},
	draw(){
		if(this.flip==-1) spr(259,this.x-3,this.y-7,15,1)
		else spr(258,this.x-3,this.y-7,15,1,this.flip)
		rect(this.x, this.y,1,1,0)
	}
}

let World={
	update(){},
	draw(){
		map(60,0,30,17,0,0,13,1)
	},
}

let Debug={
	draw(){
		m=mouse()
		let tx=Math.floor(m[0]/8)
		let ty=Math.floor(m[1]/8)

		print(m[2],10,10)
		print("mx:"+m[0]+" my:"+m[1],10,20)
		print("tx:"+tx+" ty:"+ty,10,30)
	}
}


function TIC()
{
	
	
	Player.update()
	
	cls(13)
	
	World.draw()
	Player.draw()
	
	Debug.draw()
	
	pathfinder()
	
	t++
}

LAST_MB=false
function mousep(){
	let m=mouse()
 	let isNewPress=m[2] && !LAST_MB
 	LAST_MB=m[2]
 	return isNewPress
}
// <TILES>
// 000:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 001:dddddddddddddddddddddddddddcdfddddd3d3ddddd3d3ddddded2ddddded2dd
// 002:dd2dd2dddd4444dddd4242dddd4444dddd2222dddd4444dddd2442dddd2dd2dd
// 008:444311dd444311d0444311d04443110011111111444444444444444444444444
// 009:dddddddd0dd00dd00dd00dd00000000011111111444444444444444444444444
// 010:dd1134440d1134440d1134440011344411111111444444444444444444444444
// 011:ddddddddddddddddddddddd1ddddddd1ddddddd1ddddddd1dddddddddddddddd
// 012:dddddddddddddddd1d1d1d111111111111111111133333111334331d1344439d
// 013:ddddddddd11dd00dd11dd00dd1100000d1111111d1111344dd113444dd113444
// 014:ddddddddd00dd11dd00dd11d0000011d1111111d4431111d444311dd444311dd
// 015:dd113444dd113444dd113444dd113444d1111111d1111344dd113444dd113444
// 016:dddddddddddddddddddddddddddddddddddddddddddddddddddddddd88888888
// 017:dddddddddddddddddddddddddddddddddddddddddddddddddddddddd99999999
// 018:dddddddddddddddddddddddddddddddddddddddddddddddddddddddd77777777
// 019:d2dddd2dd222222dd2dddd2dd222222dd2dddd2dd222222dd2dddd2d77777777
// 020:d2dddd2dd222222dd2dddd2dd222222dd2dddd2dd222222dd2dddd2dd222222d
// 021:ddddddddddddddddddddddddddddddddddddddddddddddddd2dddd2dd222222d
// 022:d222222dd2dddd2dd222222dd2dddd2dd222222dd2dddd2dd222222dd2dddd2d
// 023:ddddddddddddddddddddddddddddddddddddddddddddddddddddddddd2dddd2d
// 024:ddddddddddddddddddddddddddddddddddddddddd00dd00dd00dd00d00000000
// 025:ddddddddddddddddddddddddddddddddddddddddddddddddddd11dd1ddd11dd1
// 026:dddddddddddddddddddddddddddddddddddddddddddddddd1dd11dd11dd11dd1
// 027:dddddddddddddddddddddddddddddddddddddddddddddddd1dd11ddd1dd11ddd
// 028:1144439d1324439d1342439d1344239013444111134423341342334413244344
// 029:ddddddddd00dd00dd00dd00d0000000011111111444444444444444444444444
// 030:ddddddddd00dd11dd00dd11d0000011d1111111d4431111d444311dd444311dd
// 031:ddddddddd11dd00dd11dd00dd1100000d1111111d1111344dd113444dd113444
// 032:8888888888888888888888888888888888888888888888888888888888888888
// 033:7777777777777777777777777778887788888888888888888888888888888888
// 034:7777777777777777777777777777777777777777777777777777777777777777
// 035:9aaa9aaa99999999aa9aaa9a999999999aaa9aaa99999999aa9aaa9a99999999
// 036:8888888888888118888881188888888888118888811118888811888888888888
// 039:ddddddddddddddddddddddddddddddddddddddddd00dd11dd00dd11d0000011d
// 040:ddddddddddddddddddddddddddddddddddddddddd11dd00dd11dd00dd1100000
// 041:ddd11111ddd11134dddd1344dddd9344dddd9344d11d9004d11d9004d1100000
// 042:1111111144444444444444444444444444444444400440044004400400000000
// 043:11111ddd43111ddd4431dddd4439dddd4439dddd4009d00d4009d00d00000000
// 044:1144434413244344134243441344234413444111134423341342334413244344
// 045:4444444444444444444444444444444411111111444444444444444444444444
// 046:444311dd444311dd444311dd444311dd1111111d4431111d444311dd444311dd
// 047:dd113444dd113444dd113444dd113444d1111111d1111344dd113444dd113444
// 054:1344431d1344431d1344431d1344431013444111134423341342334413244344
// 055:1111111d4431111d444311dd444311dd444311dd444311dd444311dd444311dd
// 056:d1111111d1111344dd113444dd113444dd113444dd113444dd113444dd113444
// 057:d1111111d1111344dd113444dd113444dd113444dd113444dd113444dd113444
// 058:1111111144444444444444444444444444444444444444444444444444444444
// 059:1111111144444444444444444444444444444444444444444444444444444444
// 060:1144434433244344433243444344234443444111434423344342334443244344
// 061:4444444444444444444444444444444411111111444444444444444444444444
// 062:444311dd444311dd444311dd444311dd1111111d4431111d444311dd444311dd
// 063:dd113444dd113444dd113444dd113444d1111111d1111344dd113444dd113444
// 064:1221222212212222111111111222212212222122111111111221222212212222
// 065:1222212212222122111111112212222122122221111111111222212212222122
// 066:2212222122122221111111112222122222221222111111112212222122122221
// 067:2222122122221221111111112122222121222221111111112222122122221221
// 070:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 071:1111111d4431111d444311dd444399dd444399dd444399dd444399dd444399dd
// 072:d1111111d1111344dd113444dd993444dd993444dd993444dd993444dd993444
// 073:d1111111d1111344dd113444dd993444dd993444dd993444dd993444dd993444
// 074:1111111144444444444444444444444444444444444444444444444444444444
// 075:1111111144444444444444444444444444444444444444444444444444444444
// 076:1144434433244344433243444344234443444111434421114342111143211111
// 077:4444444444444444444444444444444411111111111111111111111111111111
// 078:444311dd444311dd444311dd444311dd111111dd111111dd111111dd111111dd
// 079:dd113444dd113444dd113444dd113444dd111111dd111111dd111111dd111111
// 086:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 087:ddddddddddddddddddddddddddddddddddddddddd00dd11dd00dd11d0000011d
// 088:ddddddddddddddddddddddddddddddddddddddddd11dd00dd11dd00dd1100000
// 089:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 090:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 091:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 092:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 093:ddddddddddddddddddddddddddddddddd88d888dd88d888dd8888888d8888888
// 094:dddddddddddddddddddddddddddddddd888d08dd888d08dd888888dd888888dd
// 095:dddddddddddddddddddddddddddddddddddddddddddddddddd8dddddd898dddd
// 102:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 103:1111111d4431111d444311dd444311dd444311dd444311dd444311dd44431100
// 104:d1111111d1111344dd113444dd113444dd113444dd113444dd11344400113444
// 105:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 106:ddddddddddddddddddddddddddddddddddddddddd8d888d8d8888888d8888888
// 107:dddddddddddd8dddddd898ddddd898dddd89898ddd18881ddd12221ddd12521d
// 108:ddddddddddd8dddddd898ddddd898dddd89898ddd18881ddd12221ddd12521dd
// 109:ddd11111dd112222dd122211dd122155dd122555dd122555dd122111dd112222
// 110:1111dddd22211ddd12221dd851221dd855221dd855221d8911221d8922211d88
// 111:89898ddd89898ddd989898dd989898dd989898dd8989898d8989898d8888888d
// 112:d11dd11dd11dd11dd1111111d1222213d1222213d1111113d1221333d1221333
// 113:d11dd11dd11dd11d111111113333333333333333333333333333333333333333
// 114:d11dd11dd11dd11d1111111d3122221d3122221d3111111d3331221d3331221d
// 117:ddddddddddddddddddddddddddddddddddddddddddddddddddd11dd1ddd11dd1
// 118:dddddddddddddddddddddddddddddddddddddddddddddddd1dd11ddd1dd11ddd
// 119:ddddddddddddddddddddddddddddddddddddddddddddddddddd11dd1ddd11dd1
// 120:dddddddddddddddddddddddddddddddddddddddddddddddd1dd11ddd1dd11ddd
// 122:dd12221ddd12121ddd12221ddd12221ddd12221ddd12221ddd12221ddd12221d
// 123:dd12221ddd12221ddd12521ddd12221ddd82280dd882280dd8888888dd888888
// 124:d12221ddd12221ddd12521ddd12221ddd88228ddd882288d8888888d888888dd
// 125:ddd11111dd112222dd122222dd121212dd122222dd122222dd122222dd112222
// 126:1111ddd122211d1122221d1212121d1222221d1222221d1222221d1222211d11
// 127:111111dd2222211d2212221d2151221d2555221d2555221d2111221d2222211d
// 128:d1111113d1222213d1222213d1111113d1221333d1221333d1111113d1222213
// 129:3333333333333333333333333333333333333333333333333333333333333333
// 130:3111111d3122221d3122221d3111111d3331221d3331221d3111111d3122221d
// 133:dddd1111ddd14444ddd14444ddd14444ddd14444ddd14444ddd14444ddd14444
// 134:1111113344444124444443424444434444444344444443444444434244444324
// 135:3311111144144444443444442434444442344444243444444434444444344444
// 136:1111dddd44441ddd44441ddd44441ddd44441ddd44441ddd44441ddd44441ddd
// 138:dd12221ddd12121ddd12521ddd12121ddd12221ddd12221ddd12221ddd12221d
// 139:ddd11111dd112222dd122211dd122155dd122555dd122555dd122111dd112222
// 140:11111ddd222211dd112221dd551221dd555221dd555221dd111221dd222211dd
// 141:dd111111d1122222d1222111d1221555d1225555d1225555d1221111d1122222
// 142:1111111122222222122221215122252555222525552225251122212122222222
// 143:111111dd2222211d2121221d2525221d2525221d2525221d2121221d2222211d
// 144:d1222213d1111113d1221333d1221333d1111113d1222213d1222213d1111111
// 145:3333333333333333333333333333333333333333333333333333333311111111
// 146:3122221d3111111d3331221d3331221d3111111d3122221d3122221d1111111d
// 149:ddd11111ddd14444ddd14444ddd14444ddd14444ddd14444ddd14444ddd14444
// 150:1111113344444124444443424444434444444344444443444444434244444324
// 151:3311111144144444443444442434444442344444243444444434444444344444
// 152:11111ddd44441ddd44441ddd44441ddd44441ddd44441ddd44441ddd44441ddd
// 154:dd12221ddd12121ddd12221ddd12221ddd12221ddd12221ddd12221ddd12221d
// 155:ddd11111dd112222dd122122dd122222dd122222dd122222dd122222dd112222
// 156:11111ddd222211dd221221dd222221dd222221dd222221dd222221dd222211dd
// 157:dd111111d1122222d1222222d1221221d1222222d1222222d1222222d1122222
// 158:1111111122222222222222222212212222222222222222222222222222222222
// 159:111111dd2222211d2222221d1221221d2222221d2222221d2222221d2222211d
// 160:ddddddddddddddddddddddddddddddddddddddddd11dd11dd11dd11dd1111111
// 161:ddddddddddddddddddddddddddddddddddddddddd11dd11dd11dd11d1111111d
// 162:ddddddddddddddddddddddddddddddddddddddddd11dd11dd11dd11dd1111111
// 163:ddddddddddddddddddddddddddddddddddddddddd11dd11dd11dd11d11111111
// 164:ddddddddddddddddddddddddddddddddddddddddd11dd11dd11dd11d1111111d
// 165:ddd11111ddd14444ddd14444ddd14444ddd14444ddd14444ddd14444ddd14444
// 166:111111334444412444444342a4444344c4444344c4444344b4444342b4444324
// 167:3311111144144444443444442434444442344444243444444434444444344444
// 168:11111ddd44441ddd44441ddd44441ddd44441ddd44441ddd44441ddd44441ddd
// 170:dd12221ddd12121ddd12221ddd12221ddd12221ddd12221ddd12221ddd12221d
// 171:ddd11111dd112222dd122212dd122252dd122252dd122252dd122212dd112222
// 172:11111ddd222211dd212221dd252221dd252221dd252221dd212221dd222211dd
// 173:dd111111d1122222d1221221d1225225d1225225d1225225d1221221d1122222
// 174:1111111122222222221221222252252222522522225225222212212222222222
// 175:111111dd2222211d1221221d5225221d5225221d5225221d1221221d2222211d
// 176:d1111111dd122222dd111121d1212222d1212222d1112202d1221202d1221252
// 177:1111111d222221dd121111dd2222121d2222121d2022111d2021221d2521221d
// 178:d1111111dd122222d1112111d1221222d1221222d1111122d1222212d1222212
// 179:1111111122222222111111112222222222222222222222225525525555255255
// 180:1111111d222221dd1112111d2221221d2221221d2211111d2122221d2122221d
// 181:dddddddddddddddddddddddddddddddddd0dd00dd00dd00dd0000000dd000000
// 182:ddddddddddddddddddddddddddddddddd00dd0ddd00dd00d0000000d000000dd
// 183:ddddddddddddddddddddddddddddddddd00dd00dd00dd00dd0000000d0000000
// 184:ddddddddddddddddddddddddddddddddd00dd00dd00dd00d0000000000000000
// 185:ddddddddddddddddddddddddddddddddd00dd00dd00dd00d0000000d0000000d
// 186:dd12221ddd12121ddd12521ddd12121dd882288dd882288dd8888888d8888888
// 187:ddd11111dd112222dd122122dd122222d8822882d88228828888888888888888
// 188:11111ddd222211dd221221dd222221dd2882288d2882288d8888888888888888
// 189:dd111111d1122222d1222222d1222222d8822882d88228828888888888888888
// 190:2111111211444411143333411433334114333341143333418888888888888888
// 191:111111dd2222211d2222221d2222221d2882288d2882288d8888888d8888888d
// 192:d1111222d1212222d1212222d1111121dd122222dd111212d1222122d1222122
// 193:2221111d2222121d2222121d1211111d222221dd212111dd2212221d2212221d
// 194:d1111122d1221222d1221222d1111122d1222212d1222212d1111111dd122222
// 195:5525525555255255552552553323323322222222222222222222222222222222
// 196:2211111d2221221d2221221d2211111d2122221d2122221d1111111d222221dd
// 197:ddd11111dd112222dd122222dd122122dd122222dd122222dd122222dd112222
// 198:11111ddd222211dd222221dd221221dd222221dd222221dd222221dd222211dd
// 199:dd111111d1122222d1221222d1222255d1222255d1222255d1222211d1122222
// 200:1111111122222222212222122225522222255222222552222221122222222222
// 201:111111dd2222211d2221221d5522221d5522221d5522221d1122221d2222211d
// 202:dd111111d1122222d1222222d1222552d1222552d1222552d1222112d1122222
// 203:1111111122222222212222222222552222225522222255222222112222222222
// 204:1111111122222222212222222222552222225522222255222222112222222222
// 205:1111111122222222122222212225522222255222222552222221122222222222
// 206:1111111122222222222222122255222222552222225522222211222222222222
// 207:111111dd2222211d2222221d2552221d2552221d2552221d2112221d2222211d
// 208:d1111121dd122222dd121211d1212222d1212202d1112202d1221252d1221222
// 209:1211111d222221dd112121dd2222121d2022121d2022111d2521221d2221221d
// 210:d1111122d1221222d1221222d1111122d1222212d1222212d1111122d1221222
// 211:2222222222222222222222222222222225522552255225522552255225522552
// 212:2222111d2221221d2221221d2211111d2122221d2122221d2211111d2221221d
// 213:ddd11111dd112222dd122222dd122522dd122522dd122122dd122222dd112222
// 214:11111ddd222211dd222221dd225221dd225221dd221221dd222221dd222211dd
// 215:dd111111d1122222d1221222d1222222d1222222d1222222d1222222d1122222
// 216:1111111122222222212222122222222222222222222222222222222222222222
// 217:111111dd2222211d2221221d2222221d2222221d2222221d2222221d2222211d
// 218:dd111111d1122222d1222221d1222222d1222222d1222222d1222222d1122222
// 219:1111111122222222222212222222222222222222222222222222222222222222
// 220:1111111122222222222212222222222222222222222222222222222222222222
// 221:1111111122222222212222122222222222222222222222222222222222222222
// 222:1111111122222222222122222222222222222222222222222222222222222222
// 223:111111dd2222211d1222221d2222221d2222221d2222221d2222221d2222211d
// 224:d1111222d1212222d1212222d1111121dd122222dd111212d1222122d1222122
// 225:2221111d2222121d2222121d1211111d222221dd212111dd2212221d2212221d
// 226:d1221222d1111112d1222221d1222221d1111112d1222122d1111112d1222221
// 227:2552255223322332222222222222222222222222222222222222222222222222
// 228:2221221d2111111d1222221d1222221d2111111d2212221d2111111d1222221d
// 229:ddd11111dd112222dd122222dd122122dd122222dd122222dd122222dd112222
// 230:11111ddd222211dd222221dd221221dd222221dd222221dd222221dd222211dd
// 231:dd111112d1122211d1221221d1222221d1222221d1222221d1222221d1122221
// 232:1111111114343431232323233434343423232323343434342323232334343434
// 233:211111dd1122211d1221221d1222221d1222221d1222221d1222221d1222211d
// 234:dd111111d1122222d1222122d1222222d1222222d1222222d1222222d1122222
// 235:1111112222222111221222112222221122222211222222112222221122222211
// 236:1111111114343434232323233434343423232323343434342323232334343434
// 237:1111111134343431232323233434343423232323343434342323232334343434
// 238:2211111111122222112221221122222211222222112222221122222211222222
// 239:111111dd2222211d2212221d2222221d2222221d2222221d2222221d2222211d
// 240:7777777766666666666666666666666688888888888888888888888888888888
// 241:7777777766666666666666666666666688888888888888888888888888888888
// 242:7777777766666666666666666666666688888888888888888888888888888888
// 243:7777777766666666666666666666666688888888888888888888888888888888
// 244:7777777766666666666666666666666688888888888888888888888888888888
// 245:7777777766666666666666666666666688888888888888888888888888888888
// 246:7777777766666666666666666666666688888888888888888888888888888888
// 247:7777777766666666666666666666666688888888888888888888888888888888
// 248:7777777766666666666666666666666688888888888888888888888888888888
// 249:7777777766666666666666666666666688888888888888888888888888888888
// 250:7777777766666666666666666666666688888888888888888888888888888888
// 251:7777777766666666666666666666666688888888888888888888888888888888
// 252:7777777766666666666666666666666688888888888888888888888888888888
// 253:7777777766666666666666666666666688888888888888888888888888888888
// 254:7777777766666666666666666666666688888888888888888888888888888888
// 255:7777777766666666666666666666666688888888888888888888888888888888
// </TILES>

// <SPRITES>
// 000:fffffffffffffffffffffffffffcfffffff3fffffff3fffffffefffffffeffff
// 001:ff2ff2ffff4444ffff4242ffff4444ffff2222ffff4444ffff2442ffff2ff2ff
// 002:fffffffffff444ffff4433ffff4444ffff2222ffff4444ffff2442ffff2ff2ff
// 003:ffffffffff4444ffff4334ffff4444ffff2222ffff4444ffff2442ffff2ff2ff
// 004:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 005:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 006:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 007:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 008:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 009:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 010:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 011:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 012:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 013:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 014:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 015:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 016:f111111f133333211333332113333321133333211333332112222231f111111f
// 017:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 018:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 019:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 020:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 021:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 022:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 023:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 024:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 025:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 026:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 027:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 028:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 029:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 030:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 031:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 032:fffccffffffccffffff55ffffcf55ffff3f55ffff3f99ffffef99ffffef99fff
// 033:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 034:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 035:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 036:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 037:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 038:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 039:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 040:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 041:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 042:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 043:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 044:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 045:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 046:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 047:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 048:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 049:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 050:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 051:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 052:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 053:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 054:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 055:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 056:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 057:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 058:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 059:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 060:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 061:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 062:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 063:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 064:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 065:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 066:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 067:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 068:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 069:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 070:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 071:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 072:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 073:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 074:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 075:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 076:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 077:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 078:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 079:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 080:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 081:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 082:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 083:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 084:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 085:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 086:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 087:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 088:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 089:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 090:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 091:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 092:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 093:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 094:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 095:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 096:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 097:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 098:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 099:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 100:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 101:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 102:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 103:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 104:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 105:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 106:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 107:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 108:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 109:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 110:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 111:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 112:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 113:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 114:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 115:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 116:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 117:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 118:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 119:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 120:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 121:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 122:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 123:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 124:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 125:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 126:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 127:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 128:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 129:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 130:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 131:ddddddddddddddddddddddddddddddddd99dd99dd9999999dd999999ddd99999
// 132:ddddddddddddddddddddddddddddddddd99dd99d9999999d999999dd99999ddd
// 133:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 144:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 145:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 146:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 147:dddbbbbbddb99999dd999999dd999999dd999999dd999999dd999999dd999999
// 148:bbbbbddd99999bdd999999dd999999dd999999dd999999dd999999dd999999dd
// 149:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 160:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 161:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 162:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 163:dddbbbbbddb99999dd999999dd999999dd999999dd999999dd999999dd999999
// 164:bbbbbddd99999bdd999999dd999999dd999999dd999999dd999999dd999999dd
// 165:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 169:6666666666666666666666666666666666666666666666666666666666666666
// 170:9aaa9aaa999999999dddddd99dddddd99dddddd99dddddd99dddddd99dddddd9
// 171:dd999999dd9aaa9ddd9ddddddd9ddddddd9ddddddd9ddddddd9ddddddd9ddddd
// 172:999999ddd9aaa9ddddddd9ddddddd9ddddddd9ddddddd9ddddddd9ddddddd9dd
// 173:9aaa9aa9999999999dddddd99dddddd99dddddd99dddddd99dddddd99dddddd9
// 174:ddddddddddddddddddddddddd99dd99ddaaddaad99999999aa9aaa9a99999999
// 175:ddddddddddddddddddddddddd99dd99ddaaddaadd9999999da9aaa9ad9999999
// 176:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 177:dddddddddddddddddddddddddddddddddaaddaaddaaddaaddaaaaaaaddaaaaaa
// 178:dddddddddddddddddddddddddddddddddaaddaaddaaddaadaaaaaaaaaaaaaaaa
// 179:dddbbbbbddb99999dd999999dd999999daa99aa9daa99aa9aaaaaaaaaaaaaaaa
// 180:bbbbbddd99999bdd999999dd999999dd9aa99aad9aa99aadaaaaaaaaaaaaaaaa
// 181:dddddddddddddddddddddddddddddddddaaddaaddaaddaadaaaaaaadaaaaaadd
// 184:d222222dd2dddd2dd222222dd2dddd2dd222222dd2dddd2dd222222dd2dddd2d
// 185:ddddddddddddddddddddddddddddddddddddddddd2dddd2dd222222dd2dddd2d
// 186:dd222222dd2dddd2dd222222dd2dddd2dd222222dd2dddd2dd222222dd2dddd2
// 187:222222dd2dddd2dd222222dd2dddd2dd222222dd2dddd2dd222222dd2dddd2dd
// 188:dddddddddddddddddddddddddddddddddddddddddd2dddd2dd222222dd2dddd2
// 189:dddddddddddddddddddddddddddddddddddddddd2dddd2dd222222dd2dddd2dd
// 190:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 191:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 192:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 193:dddbbbbbddbaaaaaddaaaaaaddaaaaaaddaaaaaaddaaaaaaddaaaaaaddaaaaaa
// 194:bbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
// 195:bbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
// 196:bbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
// 197:bbbbbdddaaaaabddaaaaaaddaaaaaaddaaaaaaddaaaaaaddaaaaaaddaaaaaadd
// 200:8888888888888888888888888888888888888888888888888888888888888888
// 201:6666666688888888888888888888888888888888888888888888888888888888
// 202:8888888888888118888881188888888888118888811118888811888888888888
// 203:8888888888888188888811188888818888118888811118888811888888888888
// 204:8888888888118888811118888811888888888188888811188888818888888888
// 205:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 206:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 207:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 208:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 209:dddbbbbbddbaaaaaddaaaaaaddaaaaaaddaaaaaaddaaaaaaddaaaaaaddaaaaaa
// 210:bbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
// 211:bbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa11111111
// 212:bbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
// 213:bbbbbdddaaaaabddaaaaaaddaaaaaaddaaaaaaddaaaaaaddaaaaaaddaaaaaadd
// 216:9aaa9aaa99999999aa9aaa9a999999999aaa9aaa99999999aa9aaa9a99999999
// 217:dd999999ddaa9aaadd999999dd9aaa9add999999ddaa9aaadd999999dd9aaa9a
// 218:999999ddaaa9aadd999999dda9aaa9dd999999ddaaa9aadd999999dda9aaa9dd
// 219:999999999aaa9aaa99999999aa9aaa9a999999999aaa9aaa99999999aa9aaa9a
// 220:9aaa9aaa99999999dddddddddddddddddddddddddddddddddddddddddddddddd
// 221:dddddddddddddddddddddddddddddddddddddddd99999999aa9aaa9a99999999
// 222:dddddddddddddddddddddddddddddddd9aaadddd9999ddddaa9adddd9999dddd
// 223:9aaadddd9999ddddaa9adddd9999dddd9aaadddd9999ddddaa9adddd9999dddd
// 224:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 225:dddbbbbbddbaaaaaddaaaaaaddaaaaaaddaaaaaaddaaaaaaddaaaaaaddaaaaaa
// 226:bbbbbbb1aaaaaaa1aaaaaaa1aaaaaaa1aaaaaaa1aaaaaaa1aaaaaaa1aaaaaaa1
// 227:22122122aa1aa1aa1111111122122122aa1aa1aa1111111122122122aa1aa1aa
// 228:1bbbbbbb1aaaaaaa1aaaaaaa1aaaaaaa1aaaaaaa1aaaaaaa1aaaaaaa1aaaaaaa
// 229:bbbbbdddaaaaabddaaaaaaddaaaaaaddaaaaaaddaaaaaaddaaaaaaddaaaaaadd
// 232:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 233:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 234:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 235:ddddddddddddddddddddddddd99dd99ddaaddaad99999999aa9aaa9a99999999
// 236:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 237:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 238:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 240:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 241:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 242:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 243:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 244:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 245:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 248:ddddddddddddddddddddddddd99dd99ddaaddaad9999999da9aaa9ad9999999d
// 249:d66996dddd6997ddd679967dd679967dd669977ddd7997ddddd99dddddd99ddd
// 250:dd6677ddd676667dd677667dd666767dd676667dd667667dd666677ddd7777dd
// 251:ddd99dddddd99dddddd99dddddd99dddddd99dddddd99dddddd99dddddd99ddd
// 252:9aaadddd9999ddddaa9adddd9999dddd9aaa9aaa99999999aa9aaa9a99999999
// 253:ddddddddddddddddddddddddddddddddddddaaa9dddd9999dddda9aadddd9999
// 254:ddddaaa9dddd9999dddda9aadddd9999ddddaaa9dddd9999dddda9aadddd9999
// 255:ddddaaa9dddd9999dddda9aadddd9999aaa9aaa999999999a9aaa9aa99999999
// </SPRITES>

// <MAP>
// 000:000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 001:000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 002:000000000000000071000000000000000000000000000000000000003200020000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 003:0032323232323232610000000000000000000000000000000000000032000200000000000000000000000000000000000000000000000000000000320000000000000000000000000000b0c00000000000000000000000000000320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 004:00000000000000006100000000000000000000000000000000000000320002000000000000000000000000000000000000000000000000000000003200000000000000000000000000008263d1e100d0d1d1e100000000000000320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 005:000000005100000032323200000000000000000000000000000000003200020000000000000000000000000000000000000000000000000000000032000000000000000000000000000083c3d2e200f0d2d2e200000000000000320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 006:000000324100000000000000000000000000000000000000000000003200020000000000000000000000000000000000000000000000000000000032000000000000000000000082720083c3d3e200f0d3d2e200000000000000320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 007:000000324100000000000000000000000000000000000000000000003200020000000000000000000000000000000000000000000000000000000032000000000000000000008584748184c3d28090a0d2d2e200000000000000320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 008:2121213231210021210021210000000000000000000000000000000032000200000000000000000000000000000000000000000000000000000000320000000000000000000093a3b3a3b3c3d3d2d2d2d2d2e200000000000000320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 009:1212121212121212121212120000000000000000000000000000000032000200000000000000000000000000000000000000000000000000000000320000000000000000000093a3b3a3b3c3d2d2d2d2d2d2e200000000000000320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 010:0202020202020202020202020000000000000000000000000000000032000200000000000000000000000000000000000000000000000000000000320000000000000000000093a3b3a3b3c3d3d2d2d2d3d2e200000000000000320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 011:020202020202000000000202000000000000000000000000000000003200020000000000000000000000000000000000000000000000000000000032000000b0c0000000000093a3b3a3b3c3d2d2d2d2d2d2e200000000000000320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 012:0202020200000000000002020000000000000000000000000000000032000200000000000000000000000000000000000000000000000000000000320091a1b1c1d1e100000093a3b3a3b3c3d3d2d2d2d3d2e200005767778700320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 013:0202020200000000000000020000000000000000000000000000000032000200000000000000000000000000000000000000000000000000000000320092a2b2c2d2e200000093a3b3a3b3c3d2d2d2d2d2d2e200005868788800320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 014:0202020000000000000000000000000000000000000000000000000032000200000000000000000000000000000000000000000000000000000000320093a3b3c3d3e300000093a3a3a3b3c3d3d2d2d2d3d2e200005969798900320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 015:0202000000000000000000000000000000000000000000000000000032000200000000000000000000000000000000000000000000000000000000320094a4b4c4d4e400000094a4a4a3b3c4d4d4d4d4d4d4e400105a697a8a00320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 016:020101010101010101010101000101010101010101010101010101013200020000000000000000000000000000000000000000000000000000000032121212121212121212121212121212121212121212121212121212121212320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 017:020202020202020202020202020202020202020202020202020202020202020000000000000000000000000000000000000000000000000000000032323232323232323232323232323232323232323232323232323232323232323232320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 134:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 135:020202020202020202020202020202020202020202020202020202020202020000000000000000000000000000000000000000000000000000000032323232323232323232323232323232323232323232323232323232323232320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// </MAP>

// <WAVES>
// 000:00000000ffffffff00000000ffffffff
// 001:0123456789abcdeffedcba9876543210
// 002:0123456789abcdef0123456789abcdef
// </WAVES>

// <SFX>
// 000:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000304000000000
// </SFX>

// <TRACKS>
// 000:100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// </TRACKS>

// <FLAGS>
// 000:10000000000000000000000000000000303030707070707000000000000000008080808080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// </FLAGS>

// <PALETTE>
// 000:100a0a333025585e53a5a589eae5d1dec66697ab50516b3825150f5227329c323cc4663de48d806392af2c3c6a2c1d34
// </PALETTE>

