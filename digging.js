// title:   game title
// author:  game developer, email, etc.
// desc:    short description
// site:    website link
// license: MIT License (change this to your license of choice)
// version: 0.1
// script:  js

let t=0

const gravity=.7

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
	return (mget(tx,ty)>=0&&mget(tx,ty)<=31)
}
function is_stair(x,y){
	let tiles=[16,18,19]
	let tx=Math.floor(x/8)
	let ty=Math.floor(y/8)
	return tiles.includes(mget(tx,ty))||tiles.includes(mget(tx,ty+1))
}

let queue=[]
var visited=[]
// let it=10
function read_tile(pos){
	return mget(pos.x,pos.y);
}
function check_next_pos(pos,it){
	let x=Math.floor(pos.x)
	let y=Math.floor(pos.y)
	if(visited.includes("x"+x+"y"+y)) return;
	if (!can_pass(pos.x*8,pos.y*8)) return;

	visited.push("x"+x+"y"+y)
	print(it,pos.x*8,pos.y*8,10,true,true,true)
	it++
	trace(it)
	if(it>10) return;
	let next=[
		/*next_up=*/{x:pos.x,y:pos.y-1},
		/*next_down=*/{x:pos.x,y:pos.y+1},
		/*next_left=*/{x:pos.x-1,y:pos.y},
		/*next_right=*/{x:pos.x+1,y:pos.y},
	]
	check_next_pos({x:pos.x+1,y:pos.y},it)
	check_next_pos({x:pos.x-1,y:pos.y},it)
	check_next_pos({x:pos.x,y:pos.y+1},it)
	check_next_pos({x:pos.x,y:pos.y-1},it)
	next.forEach(n => {
	// 	// if({x:k.x,y:k.y} in visited){
			
	// 	// }
		// rect(n.x*8,n.y*8,4,4,12)
		// let next2=[
		// 	/*next_up=*/{x:n.x,y:n.y-1},
		// 	/*next_down=*/{x:n.x,y:n.y+1},
		// 	/*next_left=*/{x:n.x-1,y:n.y},
		// 	/*next_right=*/{x:n.x+1,y:n.y},
		// ]
	// 	next2.forEach(n2 => {
	// 		rect(n2.x*8,n2.y*8,4,4,14)
	// if (it<10)
			// check_next_pos({x:n.x,y:n.y},it)
	// 	})
		
	// 	// if(!visited.includes("x"+n.x+"y:"+n.y))
	});
}

function path_to(e, tx, ty){
	let it=0
	visited=[]
	rect(e.x,e.y,4,4,4)
	rect(tx*8,ty*8,8,8,12)

	let start_pos={x:e.x/8,y:e.y/8}
	let target_pos={x:tx,y:ty}

	let last_pos=start_pos
	/////////
	a="x"+Math.floor(last_pos.x)+"y"+Math.floor(last_pos.y)
	visited.push(a)

	// check_next_pos(last_pos,0)
	// read_tile(last_pos)
	trace(visited)
	// trace(a)
	let next=[
		/*next_up=*/{x:last_pos.x,y:last_pos.y-1},
		/*next_down=*/{x:last_pos.x,y:last_pos.y+1},
		/*next_left=*/{x:last_pos.x-1,y:last_pos.y},
		/*next_right=*/{x:last_pos.x+1,y:last_pos.y},
	]
	next.forEach(n => {
		trace("x"+Math.floor(n.x)+"y"+Math.floor(n.y))
		// trace(visited.includes("x"+Math.floor(n.x)+"y"+Math.floor(n.y)))
		if (!(visited.includes("x"+Math.floor(n.x)+"y"+Math.floor(n.y)))) check_next_pos(n,0)
		// if("x"+n.x+"y"+n.y in visited){trace("v")}
		rect(n.x*8,n.y*8,4,4,12)
		print(it,n.x*8,n.y*8,10)
	});
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
	//draw(){spr(256,this.x-3,this.y-7,15);rect(this.x, this.y,1,1,0)}
}

function Brick(x,y){
	// let tx=
	// let ty=
	return {
		x:Math.floor(x/8)*8,y:Math.floor(y/8)*8+8,
		vx:0,vy:0,
		state:"falling",
		update(){
			this.vy=0
			this.vy+=gravity
			this.state="falling"
			mset(this.tx,this.ty,1)

			if(can_pass(this.x+1+this.vx,this.y)&&can_pass(this.x+this.vx,this.y)&&can_pass(this.x+1+this.vx,this.y-6)&&can_pass(this.x+this.vx,this.y-6)){
				this.x+=this.vx
				this.state="falling"
			}
			if(can_pass(this.x+1,this.y+this.vy)&&can_pass(this.x,this.y+this.vy)&&can_pass(this.x+1,this.y-6+this.vy)&&can_pass(this.x,this.y-6+this.vy)){
				this.y+=this.vy
				this.state="falling"
			} else {
				this.state="idle"
			}
			
			this.tx=Math.floor(this.x/8)
			this.ty=Math.floor(this.y/8)

			if (this.state=="idle"){
				mset(this.tx,this.ty,48)
			}
		},
		draw(){
			spr(48,this.x,this.y-7,15)
		}
	}
}
let bricks=[]


LAST_MB=false
function mousep(){
	let m=mouse()
 	let isNewPress=m[2] && !LAST_MB
 	LAST_MB=m[2]
 	return isNewPress
}

function TIC()
{
	m=mouse()
	let tx=Math.floor(m[0]/8)
	let ty=Math.floor(m[1]/8)
	// if(mousep()){
		// let target_tile=mget(tx,ty)
		// if(target_tile==1){
			// 	bricks[tx*ty]=Brick(m[0],m[1])
			// } else if(target_tile==48){
				// 	mset(tx,ty,1)
		// } else if(target_tile>=32&&target_tile<=47){
		// 	bricks.splice(tx*ty,1)
		// 	mset(tx,ty,1)
		// }
	
	
	Player.update()
	bricks.forEach(e=>e.update())
	
	cls(13)
	map(0,0,30,17,0,0,13,1)
	
	path_to(Player, tx,ty)
	Player.draw()
	bricks.forEach(e=>e.draw())

	print(m[2],10,10)
	print("mx:"+m[0]+" my:"+m[1],10,20)
	print("tx:"+tx+" ty:"+ty,10,30)

	if(m[2]){
	}

	t++
}

// <TILES>
// 000:6666666666666666666666666666666666666666666666666666666666666666
// 001:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 002:9aaa9aaa999999999dddddd99dddddd99dddddd99dddddd99dddddd99dddddd9
// 003:dd999999dd9aaa9ddd9ddddddd9ddddddd9ddddddd9ddddddd9ddddddd9ddddd
// 004:999999ddd9aaa9ddddddd9ddddddd9ddddddd9ddddddd9ddddddd9ddddddd9dd
// 005:9aaa9aa9999999999dddddd99dddddd99dddddd99dddddd99dddddd99dddddd9
// 006:ddddddddddddddddddddddddd99dd99ddaaddaad99999999aa9aaa9a99999999
// 007:ddddddddddddddddddddddddd99dd99ddaaddaadd9999999da9aaa9ad9999999
// 008:ddddddddddddddddddddddddd99dd99ddaaddaad9999999da9aaa9ad9999999d
// 009:d66996dddd6997ddd679967dd679967dd669977ddd7997ddddd99dddddd99ddd
// 010:dd6677ddd676667dd677667dd666767dd676667dd667667dd666677ddd7777dd
// 011:ddd99dddddd99dddddd99dddddd99dddddd99dddddd99dddddd99dddddd99ddd
// 012:dddddddddddddddddddddddddddddddddddddddddddddddddddddddd77777777
// 013:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 014:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 015:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 016:d222222dd2dddd2dd222222dd2dddd2dd222222dd2dddd2dd222222dd2dddd2d
// 017:ddddddddddddddddddddddddddddddddddddddddd2dddd2dd222222dd2dddd2d
// 018:dd222222dd2dddd2dd222222dd2dddd2dd222222dd2dddd2dd222222dd2dddd2
// 019:222222dd2dddd2dd222222dd2dddd2dd222222dd2dddd2dd222222dd2dddd2dd
// 020:dddddddddddddddddddddddddddddddddddddddddd2dddd2dd222222dd2dddd2
// 021:dddddddddddddddddddddddddddddddddddddddd2dddd2dd222222dd2dddd2dd
// 022:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 023:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 024:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 025:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 026:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 027:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 028:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 029:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 030:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 031:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 032:8888888888888888888888888888888888888888888888888888888888888888
// 033:6666666688888888888888888888888888888888888888888888888888888888
// 034:8888888888888118888881188888888888118888811118888811888888888888
// 035:8888888888888188888811188888818888118888811118888811888888888888
// 036:8888888888118888811118888811888888888188888811188888818888888888
// 037:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 038:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 039:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 040:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 041:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 042:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 043:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 044:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 045:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 046:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 047:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 048:9aaa9aaa99999999aa9aaa9a999999999aaa9aaa99999999aa9aaa9a99999999
// 049:dd999999ddaa9aaadd999999dd9aaa9add999999ddaa9aaadd999999dd9aaa9a
// 050:999999ddaaa9aadd999999dda9aaa9dd999999ddaaa9aadd999999dda9aaa9dd
// 051:999999999aaa9aaa99999999aa9aaa9a999999999aaa9aaa99999999aa9aaa9a
// 052:9aaa9aaa99999999dddddddddddddddddddddddddddddddddddddddddddddddd
// 053:dddddddddddddddddddddddddddddddddddddddd99999999aa9aaa9a99999999
// 054:dddddddddddddddddddddddddddddddd9aaadddd9999ddddaa9adddd9999dddd
// 055:9aaadddd9999ddddaa9adddd9999dddd9aaadddd9999ddddaa9adddd9999dddd
// 056:9aaadddd9999ddddaa9adddd9999dddd9aaa9aaa99999999aa9aaa9a99999999
// 057:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 058:ddddddddddddddddddddddddddddddddddddaaa9dddd9999dddda9aadddd9999
// 059:ddddaaa9dddd9999dddda9aadddd9999ddddaaa9dddd9999dddda9aadddd9999
// 060:ddddaaa9dddd9999dddda9aadddd9999aaa9aaa999999999a9aaa9aa99999999
// 061:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 062:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 063:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 064:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 065:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 066:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 067:ddddddddddddddddddddddddd99dd99ddaaddaad99999999aa9aaa9a99999999
// 068:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 069:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 070:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 071:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 072:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 073:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 074:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 075:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 076:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 077:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 078:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 079:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 080:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 081:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 082:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 083:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 084:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 085:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 086:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 087:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 088:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 089:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 090:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 091:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 092:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 093:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 094:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 095:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 096:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 097:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 098:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 099:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 100:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 101:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 102:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 103:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 104:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 105:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 106:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 107:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 108:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 109:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 110:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 111:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 112:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 113:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 114:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 115:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 116:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 117:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 118:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 119:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 120:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 121:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 122:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 123:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 124:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 125:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 126:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 127:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 128:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 129:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 130:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 131:ddddddddddddddddddddddddddddddddd99dd99dd9999999dd999999ddd99999
// 132:ddddddddddddddddddddddddddddddddd99dd99d9999999d999999dd99999ddd
// 133:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 134:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 135:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 136:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 137:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 138:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 139:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 140:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 141:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 142:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 143:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 144:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 145:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 146:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 147:dddbbbbbddb99999dd999999dd999999dd999999dd999999dd999999dd999999
// 148:bbbbbddd99999bdd999999dd999999dd999999dd999999dd999999dd999999dd
// 149:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 150:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 151:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 152:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 153:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 154:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 155:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 156:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 157:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 158:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 159:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 160:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 161:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 162:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 163:dddbbbbbddb99999dd999999dd999999dd999999dd999999dd999999dd999999
// 164:bbbbbddd99999bdd999999dd999999dd999999dd999999dd999999dd999999dd
// 165:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 166:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 167:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 168:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 169:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 170:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 171:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 172:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 173:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 174:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 175:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 176:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 177:dddddddddddddddddddddddddddddddddaaddaaddaaddaaddaaaaaaaddaaaaaa
// 178:dddddddddddddddddddddddddddddddddaaddaaddaaddaadaaaaaaaaaaaaaaaa
// 179:dddbbbbbddb99999dd999999dd999999daa99aa9daa99aa9aaaaaaaaaaaaaaaa
// 180:bbbbbddd99999bdd999999dd999999dd9aa99aad9aa99aadaaaaaaaaaaaaaaaa
// 181:dddddddddddddddddddddddddddddddddaaddaaddaaddaadaaaaaaadaaaaaadd
// 182:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 183:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 184:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 185:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 186:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 187:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 188:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 189:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 190:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 191:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 192:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 193:dddbbbbbddbaaaaaddaaaaaaddaaaaaaddaaaaaaddaaaaaaddaaaaaaddaaaaaa
// 194:bbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
// 195:bbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
// 196:bbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
// 197:bbbbbdddaaaaabddaaaaaaddaaaaaaddaaaaaaddaaaaaaddaaaaaaddaaaaaadd
// 198:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 199:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 200:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 201:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 202:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 203:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 204:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 205:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 206:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 207:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 208:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 209:dddbbbbbddbaaaaaddaaaaaaddaaaaaaddaaaaaaddaaaaaaddaaaaaaddaaaaaa
// 210:bbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
// 211:bbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa11111111
// 212:bbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
// 213:bbbbbdddaaaaabddaaaaaaddaaaaaaddaaaaaaddaaaaaaddaaaaaaddaaaaaadd
// 214:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 215:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 216:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 217:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 218:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 219:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 220:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 221:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 222:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 223:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 224:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 225:dddbbbbbddbaaaaaddaaaaaaddaaaaaaddaaaaaaddaaaaaaddaaaaaaddaaaaaa
// 226:bbbbbbb1aaaaaaa1aaaaaaa1aaaaaaa1aaaaaaa1aaaaaaa1aaaaaaa1aaaaaaa1
// 227:22122122aa1aa1aa1111111122122122aa1aa1aa1111111122122122aa1aa1aa
// 228:1bbbbbbb1aaaaaaa1aaaaaaa1aaaaaaa1aaaaaaa1aaaaaaa1aaaaaaa1aaaaaaa
// 229:bbbbbdddaaaaabddaaaaaaddaaaaaaddaaaaaaddaaaaaaddaaaaaaddaaaaaadd
// 230:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 231:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 232:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 233:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 234:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 235:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 236:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 237:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 238:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 239:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 240:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 241:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 242:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 243:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 244:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 245:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 246:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 247:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 248:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 249:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 250:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 251:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 252:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 253:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 254:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// 255:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// </TILES>

// <SPRITES>
// 000:fffccffffffccffffff55ffffff55ffffff55ffffff99ffffff99ffffff99fff
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
// 032:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
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
// 128:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 129:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 130:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 131:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 132:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 133:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 134:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 135:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 136:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 137:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 138:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 139:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 140:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 141:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 142:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 143:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 144:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 145:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 146:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 147:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 148:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 149:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 150:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 151:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 152:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 153:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 154:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 155:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 156:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 157:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 158:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 159:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 160:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 161:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 162:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 163:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 164:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 165:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 166:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 167:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 168:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 169:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 170:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 171:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 172:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 173:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 174:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 175:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 176:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 177:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 178:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 179:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 180:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 181:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 182:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 183:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 184:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 185:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 186:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 187:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 188:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 189:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 190:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 191:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 192:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 193:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 194:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 195:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 196:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 197:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 198:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 199:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 200:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 201:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 202:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 203:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 204:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 205:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 206:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 207:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 208:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 209:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 210:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 211:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 212:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 213:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 214:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 215:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 216:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 217:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 218:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 219:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 220:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 221:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 222:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 223:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 224:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 225:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 226:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 227:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 228:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 229:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 230:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 231:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 232:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 233:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 234:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 235:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 236:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 237:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 238:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 239:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 240:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 241:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 242:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 243:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 244:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 245:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 246:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 247:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 248:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 249:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 250:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 251:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 252:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 253:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 254:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 255:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// </SPRITES>

// <MAP>
// 000:101010101010101010101010101010101010101010101010101010101010020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 001:101010101010101010101010101010101010101010101060606060111010020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 002:101010101010101010101010101010101010101010101013333333018010020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 003:101010101010101010101010101010101010101010101013101010012310020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 004:101010101010101010101010101010031010101010101013333333012310020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 005:101010101010a01010101010111010111010411051101013101010012310020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 006:10a01010a01090a01010a010010303010310210331101013333333012310020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 007:10b01010b010b0b01010b010011010011010210331101030101010014010020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 008:121212121212121212121212011212121212121212121212121212121212020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 009:020202020202020242020202010202020202020202020202020202020202020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 010:020202021010100202020222010202320202020202020202020202020202020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 011:020242101010101010020202010202020202020202020202020202020202020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 012:020210101010101010100202013202020202020242020202020202020202020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 013:021010101010101010101002010202020202020202020202220202020202020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 014:021010101010101010101002010210101010101010103202020202020202020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 015:028310101010101010101010011010101010101010120202023202220202020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 016:021212121212121212121212121212121212121212020242020202020202020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 017:020202020202020202020202020202020202020202020202020202020202020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
// 135:020202020202020202020202020202020202020202020202020202020202020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
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

// <PALETTE>
// 000:100a0a333025585e53a5a589eae5d1dec66697ab50516b3825150f5227329c323cc4663de48d806392af2c3c6a2c1d34
// </PALETTE>

