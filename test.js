let arr= []
let timer = 3000
let num
function getData(newData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(newData)
    }, timer -= 1000)
  })
}
async function a(newData) {
  let flag = true
  while(arr.length > 0) {
    let cb = arr.shift()
    cb()
  }
  arr.push(() => {
    flag = false
  })
  let r = await getData(newData)
  if (flag) {
      num = r
      console.log(num)
  }
}
a(1)
a(2)