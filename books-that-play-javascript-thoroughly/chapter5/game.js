var plyaer,camera,goal,init;
var time = 0;
var state = true;

function initialize() {
	
	player = scene.getObjectByName('player');
	init = player.position.clone();             //ゲーム再開時の初期位置を保持
	camera = scene.getObjectByName("camera");
	goal = scene.getObjectByName("goal");
	goal.body.isGoal = true;　　　　　　　　　　　 //プレイヤーとゴール地点の判定に利用
	
	clock = new Clock();
	clock.start();
	
	checkContactObjects(scene.world);
	
}
	
	
//プレイヤーオブジェクトの位置が更新されるたびにゲーム内のオブジェクトを取得する
function checkContactObjects(world) {
	world.addEventListener("postStep", function(e) {
		if(world.contacts.length > 0) {
			for(var i = 0; i < world.contacts.length; i++) {
				detectGoal(world.contacts[i]);
			}
		}
	})
}


//プレイヤーとゴール地点が接触しているかを判定する
function detectGoal(contact) {
	if(contact.bi.id === player.body.id || contact.bj.id === player.body.id) {
		if(contact.bi.isGoal || contact.bj.isGoal) {
			contact.bi.isGoal = false;
			contact.bj.isGoal = false;
			
			var result = confirm(time.toFixed(2) + '秒でゴールしました！\nリトライしますか？\n【OK】はい【キャンセル】いいえ');
			
			gameInit(result);
		}
	}
}


//ゲーム再開時の初期化処理
function gameInit(result) {
	if(result) {
		player.body.position.set(init.x, init.y, init.z);
		camera.position.set(init.x, init.y+5, init.z+15);
		player.body.velocity.set(0, 0, 0);
		time = 0;
		setTimeout(function() { goal.body.isGoal = true; }, 1000); //プレイヤーが初期位置に戻ってからisGoalをtrueにする
	} else {
		state = false;
		clock.stop();
	}
}


function update() {
	
  //stateがtrueの時だけキーボード操作ができるようにする
	if(state) {
	time += clock.getDelta();
		
	if(Keyboard.keyPressed(Keyboard.LEFT)) {
		player.body.velocity.x -= 0.3;
	}
	if(Keyboard.keyPressed(Keyboard.RIGHT)) {
		player.body.velocity.x += 0.3;
	}
	if(Keyboard.keyPressed(Keyboard.UP)) {
		player.body.velocity.z -= 0.3;
	}
	if(Keyboard.keyPressed(Keyboard.DOWN)) {
		player.body.velocity.z += 0.3;
	}
	
  //z軸、y軸をそれぞれ離すことで上空から見下ろしたスタイルでプレイできるようにする
	camera.position.z = player.body.position.z + 15;
	camera.position.y = player.body.position.y + 5;
	camera.position.x = player.body.position.x;
  
  //プレイヤーが落下した時の処理
  if(player.body.position.y < -45) {
    var result = confirm('ゲームオーバー！\nリトライしますか？\n【OK】はい【キャンセル】いいえ');
    gameInit(result);
  }
	}
}

