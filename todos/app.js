//数据
// var todoData = [
// 	{
// 		title:'123',
// 		isChecked:false //未选择
// 	},
// 	{
// 		title:'234',
// 		isChecked:true //已选择
// 	}
// ];

var store = {
	save(key,value){
		localStorage.setItem(key, JSON.stringify(value));
	},
	fetch(key){
		return JSON.parse(localStorage.getItem(key)) || [];
	}
}
//获取所有的值
var todoData = store.fetch('todoDatas');
//过滤三种情况
var filterData = {
	all(list){
		return list;
	},
	unfinished(list){
		return list.filter(function(item){
			return !item.isChecked;
		})
	},
	finished(list){
		return list.filter(function(item){
			return item.isChecked;
		})
	}
}
//实例化vue
var vm = new Vue({
	el:'.main',
	data:{
		list:todoData,
		todo:'',
		edtorTodos:'', 
		beforTitle:'',
		visibility:'all'
	},
	methods:{
		addTodo(){	//添加任务
			if(this.todo != ''){
				this.list.unshift({
					title:this.todo,
					isChecked:false
				});
				this.todo = '';	
			}else{
				alert('写出你的计划！');
			}
			
		},
		delTodo(todo){	//删除任务
			var index = this.list.indexOf(todo);
			this.list.splice(index,1);
		},
		edtorTodo(todo){ //编辑任务
			this.beforTitle = todo.title;
			this.edtorTodos = todo;
		},
		edtorTodoed(todo){ //任务已经编辑完成
			this.edtorTodos = '';
		},
		cancelTodo(todo){
			todo.title = this.beforTitle;
			this.edtorTodos = '';
			this.beforTitle = '';
		}
	},
	computed:{
		noCheckedLength(){
			return this.list.filter(function(item){
				return !item.isChecked;
			}).length;
		},
		filterList(){
			return filterData[this.visibility] ? filterData[this.visibility](todoData) : todoData;
		}
	},
	directives:{	//钩子函数
		"foucs":{
			update(el,binding){
				if(binding.value){
					el.focus();
				}
			}
		}
	},
	watch:{	     //深度监控数据
		list:{
			handler(){
				store.save('todoDatas',this.list);
			},
			deep:true
		}
	}
});

function watchHashChange(){
	var hash = window.location.hash.slice(1);
	vm.visibility = hash;
	// console.log(hash)
}
watchHashChange();
window.addEventListener('hashchange',watchHashChange);
