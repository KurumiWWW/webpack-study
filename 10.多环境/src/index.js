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

const button = document.createElement("button");
button.textContent = "加法";
button.addEventListener("click", () => {
  // import(/*webpackChunkName:"math", webpackPrefetch: true*/ "./math.js").then(
  //   ({ add }) => {
  //     console.log(add(1, 2));
  //   }
  // );
  import(/*webpackChunkName:"math", webpackPreload: true*/ "./math.js").then(
    ({ add }) => {
      console.log(add(1, 2));
    }
  );
});
document.body.appendChild(button);
