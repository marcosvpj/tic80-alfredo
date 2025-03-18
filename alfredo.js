// title:   game title
// author:  game developer, email, etc.
// desc:    short description
// site:    website link
// license: MIT License (change this to your license of choice)
// version: 0.1
// script:  js

function limitXY(e){
	if(e.x>234)e.x--
	if(e.x<-2)e.x++
	if(e.y<25)e.y++
	if(e.y>127)e.y--
}
function label(e,s){print(s,e.x,e.y+10)}
function update(e,i,a){	e.update(e,i,a)}
function draw(e,i,arr){	if(!!e.draw) {e.draw(e)}}
function rnd(m){ return Math.floor(Math.random() * m)}

var t=0
var x=96
var y=24
var hour=0
var day=0

var is_day=true
var night_time=100

let color_sky=10
let color_grass=5

let stats={
	money:100,
	mind:100,
	energy:0,
	food:10,
	hunger:0,
}

let builds=[]

let build_opts=[
	{id:1,s:320,name:"painel",d:()=>{},
		b(){return{
			x:0,y:0,
			sprite:40,
			costs:{money:5},
			draw(e){
				spr(288,e.x,e.y+2,color_grass,1,0,0,2,1)
			},
			update(e){
				if(hour%240==0&&is_day)stats.energy+=10
			}
		}}
	},
	{id:2,s:323,name:"ligth",d:()=>{},
		b:()=>{return{
			x:0,y:0,
			sprite:289,
			costs:{money:1},
			effects:{energy:-1},
			update(e){
				if(hour%240==0&&!is_day&&stats.energy>=3)stats.energy-=3
			},
			draw(e){
				if(is_day||stats.energy<3){
					spr(322,e.x,e.y+3,color_grass,1,0,0,1,1)
				} else {
					elli(e.x+3,e.y+8,15,10,color_grass)
					spr(323,e.x,e.y+3,color_grass,1,0,0,1,1)
				}
			}
		}}

	},
	{id:3,s:321,name:"carrot",d:()=>{},
		b:()=>{return{
			x:0,y:0,
			costs:{money:1},
			age:0,
			t:time(),
			draw(e){
				if(e.age>=7400) spr(327,e.x,e.y,color_grass)
				else if(e.age>=4800) spr(326,e.x,e.y,color_grass)
				else if(e.age>=2400) spr(325,e.x,e.y,color_grass)
				else spr(324,e.x,e.y,color_grass)
				// if(e.age>=7400) spr(298,e.x,e.y,color_grass,1,0,0,2,2)
				// else if(e.age>=4800) spr(294,e.x,e.y,color_grass,1,0,0,2,2)
				// else if(e.age>=2400) spr(294,e.x,e.y,color_grass,1,0,0,2,2)
				// else spr(292,e.x,e.y,color_grass,1,0,0,2,2)
				// print(e.age,e.x,e.y)
				// label(e,e.age)
			},
			update(e){
				e.age++
			}
		}}
	},
]

let ui={
	menu_selected:0,
	select_menu(){
		this.menu_selected++
		if (this.menu_selected>build_opts.length) this.menu_selected=0
	},
	update(){
		if(btnp(4)) this.select_menu()
		if(btnp(5)) build(this.menu_selected)
	},
	d_menu(x,y){
		rect(x+1,y-1,16,1,14)
		rect(x,y,18,(build_opts.length*19)-1,13)
		build_opts.forEach((e,i,a)=>{
			spr(e.s,(x+5),(y+6)+i*19,color_grass,1,0,0)
			spr((this.menu_selected==e.id?258:256),x+1,(y+1)+i*19,color_grass,1,0,0,2,2)
		})
	},
	d_stats(x,y){
		w=print(stats.food+" ("+stats.hunger+")",x+10,y+(9*3)+1,15,false,1,true)
		rect(x-1,y-1,x+10+w,9*4,13)
		spr(261,x,y+(9*0),color_grass)
		spr(278,x,y+(9*1),color_grass)
		spr(277,x,y+(9*2),color_grass)
		spr(262,x,y+(9*3),color_grass)
		print(stats.mind,x+10,y+(9*0)+1,15,false,1,true)
		print(stats.money,x+10,y+(9*1)+1,15,false,1,true)
		print(stats.energy,x+10,y+(9*2)+1,15,false,1,true)
		print(stats.food+"("+stats.hunger+")",x+10,y+(9*3)+1,15,false,1,true)
	},
	draw(){
		this.d_menu(220,32)
		this.d_stats(2,32)
		print("x:"+player.x+" y:"+player.y+" day:"+day+" hour:"+hour+" t:"+t,5,124,1,true,1,true)
	}
}

let panda={
	x:84,y:84,
	flip:0,
	state:"idle",
	update(e){
		if(btnp(6)) this.state="hunt"

		limitXY(this)
		if(!(t%30/15)) return
		switch (this.state) {
			case "hunt":
				var target=animals_alive[0]
				animals_alive.forEach((e,i,arr)=>{
					//TODO:find closest
					if(e.type=="bird") target=e
				})
				if(this.x>target.x) this.x-=rnd(3)
				if(this.x<target.x) this.x+=rnd(3)
				if(this.y>target.y) this.y-=rnd(3)
				if(this.y<target.y) this.y+=rnd(3)
				
				if(target.y<0) this.state="walk"
				break;
			case "walk":
				if(this.x>player.x) this.x-=rnd(3)
				if(this.x<player.x) this.x+=rnd(3)
				if(this.y>player.y) this.y-=rnd(3)
				if(this.y<player.y) this.y+=rnd(3)
				if(this.x>player.x) this.flip=1
				if(this.x<player.x) this.flip=0
				if(Math.abs(panda.x-player.x)<30&&Math.abs(panda.y-player.y)<20) this.state="idle"
			break			
			default:
				if(Math.abs(panda.x-player.x)>30||Math.abs(panda.y-player.y)>20) this.state="walk"
				else this.state="idle"
			break;
		}
		
	},
	draw(t){
		if(this.state=="idle") spr((((t%60)/30|0)+34),this.x,this.y,5,1,this.flip)
		if(this.state=="walk") spr((((t%60)/30|0)+38),this.x,this.y,5,1,this.flip)
		if(this.state=="hunt") spr((((t%60)/30|0)+38),this.x,this.y,5,1,this.flip)
		label(this,this.state)
	}
}

let animals={
	pato:{new(x,y){
		return{
			type:"bird",
			x:x,y:y,
			flip:0,
			state:"idle",
			update(e,i,arr){
				if(this.y<0) arr.splice(i,1)
				if(!(t%60/30)) return
	
				// Should change state?
				if(e.y<21) {e.state="fly"}
				else if(Math.abs(panda.x-e.x)<20&&Math.abs(panda.y-e.y)<15) {e.state="fly"}
				else if(rnd(10)>7) {e.state="walk"}
				else {e.state="idle"}
				
				// Update by state
				switch (e.state) {
					case "fly":
						var v=3
						if(Math.abs(panda.x-e.x)<5)v=5
						if(e.x>panda.x)e.x+=rnd(v)
						if(e.x<panda.x)e.x-=rnd(v)
								
						if(Math.abs(panda.y-e.y)<5)v=5
						if(e.y>panda.y)e.y+=rnd(v)
						if(e.y<=panda.y)e.y-=rnd(v)
								
						if(this.x>234)this.x=234
						if(this.x<-2)this.x=-2
						if(this.y>127)this.y=127
					break;
					case "walk":
						let dx=rnd(3)-1
						let dy=rnd(3)-1
						
						if(dx>0)this.flip=1
						if(dx<0)this.flip=0
						
						this.x+=dx
						this.y+=dy
						limitXY(this)
					break;
					default: e.state="idle"; break;
				}
			},
			draw(e)
			{
				let v=(t%10/5|0)
				switch (e.state) {
					case "idle":spr(v+20,this.x,this.y,5,1,this.flip);break;
					case "walk":spr(v+18,this.x,this.y,5,1,this.flip);break;
					case "fly":spr(v+22,this.x,this.y,5,1,this.flip);break;
				}
				label(this, this.state+" "+v)
			}
		}
	}},
	ovelha:{new(x,y){
		return{
			type:"farm",
			x:x,y:y,
			flip:0,
			state:"idle",
			update(e,i,arr){
				if(this.y<0) arr.splice(i,1)
				if(!(t%60/30)) return
	
				// Should change state?
				if(rnd(10)>7) {e.state="walk"}
				else {e.state="idle"}
				
				// Update by state
				switch (e.state) {
					case "walk":
						let dx=rnd(3)-1
						let dy=rnd(3)-1
						
						if(dx>0)this.flip=1
						if(dx<0)this.flip=0
						
						this.x+=dx
						this.y+=dy
						limitXY(this)
					break;
					default: e.state="idle"; break;
				}
			},
			draw(e)
			{
				let v=(t%10/5|0)
				switch (e.state) {
					case "idle":spr(v+66,this.x,this.y,5,1,this.flip);break;
					case "walk":spr(v+68,this.x,this.y,5,1,this.flip);break;
				}
				label(this, this.state+" "+v)
			}
		}
	}}
}
var a1=animals.pato.new(84,84)
let animals_alive=[a1,animals.ovelha.new(84,84)]

let player={
	x:96,y:24,
	flip:1,
	state:"idle",
	update(){
		this.state="idle"
		if(btn(0)){
			this.state="walk"
			this.y--
		}
		if(btn(1)){
			this.state="walk"
			this.y++
		}
		if(btn(2)){
			this.state="walk"
			this.x--
			this.flip=0
		}
		if(btn(3)){
			this.state="walk"
			this.x++
			this.flip=1
		}

		if(this.x>234) this.x=234
		if(this.x< -2) this.x=-2
		if(this.y< 21) this.y=21
		if(this.y>127) this.y=127

		if(!is_day&&pix(player.x+3,player.y+13)==7&&hour%120==0) stats.mind-=3
	},
	draw(){spr((this.state=="walk"?0+((t%60)/30|0):0),this.x,this.y,5,1,this.flip,0,1,2)}
}

let world={
	update(){
		hour=t%2400
		day=Math.floor(t/2400)
		is_day=(hour/10<night_time)

		if(!(t%120/60)&&animals_alive.length<5){
			var a=animals.pato.new(rnd(246),136)
			animals_alive.push(a)
		}
	},
	draw(){
		cls(6)
		
		// sky
		if(is_day)rect(0,0,240,60,color_sky)
		else rect(0,0,240,60,8)
		
		// clouds
		color_cloud=12
		if(!is_day)color_cloud=13
		elli(240-hour/10,30,15,10,color_cloud)	
		elli(260-hour/10,20,15,10,color_cloud)
		elli(210-hour/10,30,20,15,color_cloud)
		
		// grass
		if(is_day)rect(0,30,240,130,color_grass)
		else rect(0,30,240,130,7)
	
		// dirt
		elli(84,84,20,15,4)
		
		//sun
		rect(5,9,230,1,14)
		rect(night_time-5,9,240-night_time,1,15)
		if(is_day) spr(9,hour/10*.95,5,color_grass)
		else spr(10,hour/10*.95,5,color_grass)

		spr(300,184,84,color_grass,1,0,0,2,2)
	}
}

function TIC()
{
	// // UPDATE	
	if(hour%60==0) stats.hunger+=10
	if(stats.hunger>100){
		stats.food--
		stats.hunger=0
	}
	
	//each night	
	if(hour/10==night_time){
		if(stats.food<0) stats.mind-=5
		if(stats.energy>0) stats.energy-=5
	}

	world.update()
	player.update()
	panda.update(t)
	animals_alive.forEach(update)
	builds.forEach(update)
	
	ui.update()

	// DRAW
	// background
	world.draw()

	// actors
	builds.forEach(draw)
	animals_alive.forEach(draw)
	panda.draw(t)
	player.draw()

	// ui
	ui.draw()
	
	t++
}

function build(i){
	var b=false
	
	switch (i) {
		case 1: b=build_opts[0].b();break;
		case 2: b=build_opts[1].b();break;
		case 3: b=build_opts[2].b();break;
		default: return
	}
	stats.money-=b.costs.money
	b.x=player.x
	b.y=player.y
	builds.push(b)
}
