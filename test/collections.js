function Person(name, email, website){
    this.name = name;
    this.email = email;
    this.website = website;
};
 
Person.prototype.sayHello = function(){
    var hello = "Hello, I am "+ this.name  + ", <br>" +
                "my email is: " + this.email + ", <br>" +
                "my website is: " + this.website;
    return hello;
};
 
function Student(name, email, website, no, dept){
    var proto = Object.getPrototypeOf;
    proto(Student.prototype).constructor.call(this, name, email, website);
    this.no = no;
    this.dept = dept;
}
 
// 继承prototype
Student.prototype = Object.create(Person.prototype);
 
//重置构造函数
Student.prototype.constructor = Student;
 
//重载sayHello()
Student.prototype.sayHello = function(){
    var proto = Object.getPrototypeOf;
    var hello = proto(Student.prototype).sayHello.call(this) + '<br>';
    hello += "my student no is: " + this. no + ", <br>" +
             "my departent is: " + this. dept;
    return hello;
};
 
var me = new Student(
    "Chen Hao",
    "haoel@hotmail.com",
    "http://coolshell.cn",
    "12345678",
    "Computer Science"
);
document.write(me.sayHello());