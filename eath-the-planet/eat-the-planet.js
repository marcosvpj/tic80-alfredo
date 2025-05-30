// title:   game title
// author:  game developer, email, etc.
// desc:    short description
// site:    website link
// license: MIT License (change this to your license of choice)
// version: 0.1
// script:  js

const GRAVITY=.1
var t=0
var x=96
var y=24

const TILE_BASE=17
const TILE_SOLID=16
const TILE_SOLID_MINING=18
const TILE_OPEN=0
const MOUSE={x:0,y:0}

function can_pass(pos,target){
	if(mget(target.x/8,target.y/8)==TILE_SOLID)return false
	return mget(target.x/8,target.y/8)==TILE_OPEN
}
function in_air(pos){
	return mget(pos.x/8,(pos.y+1)/8)==TILE_OPEN
}
function is_solid(pos){
	return mget(pos.x/8,pos.y/8)==TILE_SOLID
}
function is_base(pos){
	return mget(pos.x/8,pos.y/8)==TILE_BASE
}
const Base={
	pos:{x:114,y:116},
	stones:0,
	draw(){
		spr(TILE_BASE,Math.floor(this.pos.x/8)*8,Math.floor(this.pos.y/8)*8,1)
		print(this.stones,this.pos.x,this.pos.y+4)
	}
}
function T(x,y){
	return {
		pos:{x:x,y:y},
		spd:{x:0,y:0},
		speed:.3,
		state:"IDLE",
		stones:0,
		is_colliding(target){
			let p=this.pos
			return (target.x>=p.x-4+1&&target.x<=p.x-4+8-2&&target.y>=p.y-6&&target.y<=p.y-6+8-2)
		},
		is_adjacent(target){
			let p=this.pos
			let t=target

			t.y=target.y
			t.x=target.x+8
			if(t.x>=p.x-4+1&&t.x<=p.x-4+8-2&&t.y>=p.y-6&&t.y<=p.y-6+8-2)return true
			t.x=target.x-8
			if(t.x>=p.x-4+1&&t.x<=p.x-4+8-2&&t.y>=p.y-6&&t.y<=p.y-6+8-2)return true

			t.x=target.x
			t.y=target.y+8
			if(t.x>=p.x-4+1&&t.x<=p.x-4+8-2&&t.y>=p.y-6&&t.y<=p.y-6+8-2)return true
			t.y=target.y-8
			if(t.x>=p.x-4+1&&t.x<=p.x-4+8-2&&t.y>=p.y-6&&t.y<=p.y-6+8-2)return true
		},
		squish(){
			this.state="SQUISH"
		},
		jump(){
			if(!in_air(this.pos)){
				this.spd.y=-1
				this.state="JUMPING"
			}
		},
		goto_target:{x:x,y:y},
		goto_action:undefined,
		goto(target,action,state="MOVING"){
			let x=Math.floor(target.x/8)*8
			let y=Math.floor(target.y/8)*8
			this.goto_target={x:target.x,y:target.y}
			this.goto_action=action
			this.state=state
		},
		goto_mine(target){
			const t={x:target.x,y:target.y}
			this.goto(t,function(){
				this.jump()
				this.state="MINING"
				world_blocks[Math.floor(t.x/8)][Math.floor(t.y/8)].mine(()=>{
					this.stones+=1
					this.delivery_stone()
				})
			})
		},
		delivery_stone(){
			this.goto({x:Base.pos.x,y:Base.pos.y-8},()=>{
				Base.stones+=this.stones
				this.stones=0
			},"DELIVERING_STONE")
		},
		update(){
			let p=this.pos
			
			if(this.is_colliding(MOUSE))this.squish()
			if(this.state=="SQUISH"&&!this.is_colliding(MOUSE))this.state="IDLE"
			
			//if reach target 
			// or is adjacent if solid
			if(this.goto_target!==false
				&&(
					(!is_solid(this.goto_target)&&this.is_colliding(this.goto_target))
					||(is_solid(this.goto_target)&&this.is_adjacent(this.goto_target))
					||(is_base(this.goto_target)&&this.is_adjacent(this.goto_target))
				)){
				this.spd.x=0
				this.goto_target=false
				this.state="IDLE"
				if(this.goto_action!=undefined)(this.goto_action)()
				this.goto_action==undefined
			}

			//walk x-axys in target direction
			if(this.goto_target!==false&&this.pos.x>this.goto_target.x)this.spd.x=-this.speed
			else if(this.goto_target!==false&&this.pos.x<this.goto_target.x)this.spd.x=this.speed
			else if(this.goto_target!==false)this.spd.x=0

			//Gravity falling effect
			if(in_air(p))this.spd.y+=GRAVITY

			//Move if possible
			if(can_pass(p,{x:p.x+this.spd.x,y:p.y}))this.pos.x+=this.spd.x
			if(can_pass(p,{x:p.x,y:p.y+this.spd.y}))this.pos.y+=this.spd.y
			
		},
		draw(){
			rect(this.pos.x,this.pos.y,1,1,4)
			let s=256
			if(this.state=="SQUISH") spr(256+t%60/30,this.pos.x-4,this.pos.y-6,1)
			else spr(256,this.pos.x-4,this.pos.y-6,1)
			print(this.stones,this.pos.x,this.pos.y-12)
			print(this.state,this.pos.x,this.pos.y+4)
		}
	}
}
const ts=[]
ts.push(T(84,84))

function Block(x,y){
	return {
		pos:{x:x,y:y},
		state:"IDLE",
		integrity:100,
		update(){
			if(this.state=="MINING"){
				if(Math.floor(t%60/30)==0) this.integrity-=10
			}
			if(this.integrity<=0)this.destroy()
		},
		draw(){
			spr(TILE_SOLID,this.pos.x,this.pos.y,1)
			if(this.state=="MINING"){
				spr(TILE_SOLID_MINING+t%60/20,this.pos.x,this.pos.y,1)
				// print(this.integrity,this.pos.x,this.pos.y)
			}
		},
		mine(callback){
			trace("mining")
			this.state="MINING"
			this.mine_callback=callback
		},
		destroy(){
			if(this.mine_callback!=undefined)this.mine_callback()
			mset(Math.floor(this.pos.x/8),Math.floor(this.pos.y/8),TILE_OPEN)
			delete world_blocks[Math.floor(this.pos.x/8)][Math.floor(this.pos.y/8)]
		}
	}
}
const world_blocks=[]
function create_world_info(){
	for (let x = 0; x < 30; x++) {
		for (let y = 0; y < 17; y++) {
			if(mget(x,y)==TILE_SOLID){
				if (world_blocks[x]==undefined)world_blocks[x]=[]
				world_blocks[x][y]=Block(x*8,y*8)
			}
		}
	}
}
create_world_info()

function TIC()
{
	let m = mouse()
	MOUSE.x=m[0]
	MOUSE.y=m[1]
	
	if(m[2]){
		if(is_solid(MOUSE)) ts[0].goto_mine(MOUSE)
		else ts[0].goto(MOUSE)
	}
	
	ts.forEach(i=>i.update())
	function blocks_update(){
		for (let x = 0; x < 30; x++) {
			for (let y = 0; y < 17; y++) {
				if (world_blocks[x][y]!=undefined)	world_blocks[x][y].update()
			}
		}
	}
	function blocks_draw(){
		for (let x = 0; x < 30; x++) {
			for (let y = 0; y < 17; y++) {
				if (world_blocks[x][y]!=undefined)	world_blocks[x][y].draw()
			}
		}
	}
	blocks_update()
	// world_blocks.forEach((i)=>{if(i.update!==undefined) i.update()})
	cls(1)
	map(0,0,30,17,0,0,1)
	
	// world_blocks.forEach((i)=>{if(i.draw!==undefined) i.draw()})
	blocks_draw()
	Base.draw()
	ts.forEach(i=>i.draw())
	
	rectb(Math.floor(MOUSE.x/8)*8,Math.floor(MOUSE.y/8)*8,8,8,3)

	print(Math.floor(t%60/6),10,10)
	print("mouse.x:"+MOUSE.x+" mouse.y:"+MOUSE.y,10,10)
	t++
}

// <TILES>
// 000:1111111111111111111111111111111111111111111111111111111111111111
// 001:3333333333333333333333333333333333333333333333333333333333333333
// 002:1111111111111111111111111111111111111111111111111111111111111111
// 003:1111111111111111111111111111111111111111111111111111111111111111
// 004:1111111111111111111111111111111111111111111111111111111111111111
// 017:0444444000000000000000000000000000000000000000000000000000000000
// 018:000000000f0000000000f0000000000f0000000000f0000000000f0000000000
// 019:00f0f00f000f00f000f0f00f000000000f000ff0fff000ff0f0000000000ff00
// 020:0f0f0f0000f000f00f0f0f0f00f000f0f000f0000f0f0f0f00f000f00f0f0f00
// 032:7767666676666676767677676607007067706600667000007606000066706000
// 033:7666766666766676076707676070607006000600000000000000000000000000
// 034:7666766666766676076707676070607006000600000000000000000000000000
// 035:6667667767666767077076766006076706606066000076760006076600006067
// 043:7666766666766676076707676070607006000600000000000000000000000000
// 044:7666766666766676076707676070607006000600000000000000000000000000
// 045:7666766666766676076707676070607006000600000000000000000000000000
// 046:6667667767666767077076766006076706606066000076760006076600006067
// 048:6767000066700000760600006670600067670000660600006670600067670000
// 049:0000505005050505005555550555555550555555055555555055555505555555
// 050:0505000050505050555555005555555055555505555555505555550555555550
// 051:0000076600007676000607660000606600000767000607660000607600000766
// 059:7666766666766676076707676070607006000600000000000050050005055050
// 060:7666766666766676076707676070607006000600000000000050050005055050
// 061:6667667767666767077076766006076706606066000076760006076650006067
// 062:0000076600007676000607660000606600000767000607660000607600000766
// 064:6767000066700000760600006670600067670000660600006670600067670000
// 065:0555555550555555055555555055555505555555005555550505050500005050
// 066:5555555055555505555555505555550555555550555555005050505005050000
// 067:0000076600007676000607660000606600000767000607660000607600000766
// 077:0000076650007676050607665000606650000767050607665000607600000766
// 078:0000076600007676000607660000606600000767000607660000607600000766
// 080:6670000076060000667060006767006066707606670760707676766677666676
// 081:0000000000000000000000000060006007060706767076706766676666676667
// 082:0000000000000000000000000060006007060706767076706766676666676667
// 083:0000607600060766006076760000076607607076760767676766767666666767
// 093:0000076650007676050607665000606650000767050607665000607600000766
// 094:0000607600000767000070700000060700000070000000000000000000000000
// 095:7666766666766676076707676070607006000600000000000000000000000000
// 096:0000000000000000000000000000000000000000000000000006660000667760
// 097:0000000000000000000000000000000000000000000000000000000000660000
// 098:0000000000000000000000000000000000000000000770000007707000777777
// 099:000000000000000000000000000000000333330003333300000f000000030000
// 100:0000000000000000000000000000000000000000000320000002200000022000
// 102:0000000000000000000000000000000000000000000320000002200000022000
// 103:00e00e000dddddd000f00f0000e00e000dddddd000f00f0000e00e000dddddd0
// 109:0000607650000767050070705000060700000070050000005050050005005050
// 110:7666766666766676076707676070607006000600000000000050050005055050
// 111:7666766666766676076707676070607006000600000000000050050005055050
// 112:5555555566666666666fff66fff333ff33344433444444444444444444444444
// 113:555555556666666666666666ffffffff33333333444444444444444444444444
// 114:55555555666666666ff66666f33fffff34433333444444444444444444444444
// 115:333333332222222222222222ffffffff00000000000000000000000000000000
// 116:333333332222222222222222ffffffff000ff000000ff0000002200000022000
// 117:333333332222222222222222ffffffff00000000000000000000000000000000
// 118:333333302222222022222220fffffff0000ff000000ff0000002200000022000
// 119:00f00f0000e00e000dddddd000f00f0000e00e000dddddd000f00f0000e00e00
// 120:00e00e000dddddd00dddddd000f00f0000e00e000dddddd00dddddd000f00f00
// 128:4444444444444444444444444444444444444444444444444444444444444444
// 129:4444444444444444444444444444444444444444444444444444444444444444
// 130:4444444444444444444444444444444444444444444444444444444444444444
// 132:0002200000022000000220000002200000022000000220000002200000022000
// 134:0002200000022000000220000002200000022000000220000002200000022000
// 135:0dddddd000f00f0000e00e000dddddd000f00f0000e00e000dddddd000f00f00
// 136:00e00e000dddddd00dddddd000f00f0000e00e000dddddd00dddddd000f00f00
// </TILES>

// <SPRITES>
// 000:11111111177cc771177cc7711cccccc11cccccc11cccccc11cc11cc111111111
// 001:111111111111111111111111177cc771177cc7711cccccc11cc11cc111111111
// 002:00000000000000000000000000000000000000000009a0000090ca0000a00a00
// 003:0000000000000000000000000000000000000000000000000009a0000090ca00
// 004:00000000000000000000000000000000000000000000aa0000090ca0000900a0
// 016:111111111c1111c11cccccc11c1111c11cccccc11c1111c11cccccc11c1111c1
// 032:1cccccc11c1111c11cccccc11c1111c11cccccc11c1111c11cccccc11c1111c1
// 048:1111111111111111111111111111111111111111111111111111111111111111
// </SPRITES>

// <MAP>
// 008:000001010100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 009:000101010101000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 010:000101010101000000000000000000000000000000000000000001010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 011:000101010101000000000000000000000000000000000000000101010100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 012:000101010101000000000000000000000000000000000000000101010100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 013:000101010101000000000000000000000000000000000000000101010100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 014:010101010101010101010101010111010101010101010101010101010101000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 015:010101010101010101010101010101010101010101010101010101010101000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 016:010101010101010101010101010101010101010101010101010101010101000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
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
// 000:1a1c2c5d275db13e53ef7d57ffcd75a7f07038b76425717929366f3b5dc941a6f673eff7f4f4f494b0c2566c86333c57
// </PALETTE>

