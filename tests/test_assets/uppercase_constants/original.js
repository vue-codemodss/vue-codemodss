const myRepeatedString = 'Some string';
const myRepeatedRegexp = /foobar/;
let dynamicString = 'Dynamic string';
function foo() {
  const signal = 'Some other string'.match(/foobar/) ? '!' : '-';
  return myRepeatedString + signal + 'Some string';
}

function bar() {
  let myRepeatedString = 'Some other string';
  return myRepeatedString + '...';
}

const myUniqueString = 'I only show up once...';
const myOtherUniqueVariable = 'foobar'.match(/baz/);

console.log(foo('Some string'), bar(), dynamicString, myUniqueString, myRepeatedString);
