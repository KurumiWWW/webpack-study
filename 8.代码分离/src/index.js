import _ from "lodash";
console.log(_.join(["1", "2", "3"], "-"));
import "./async.js";

function fun1() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("hello world");
    }, 3000);
  });
}

async function fun2() {
  const res = await fun1();
  console.log(res);
}

fun2();
