# Vue codemodss

This repository contains a collection of codemod scripts for use with JSCodeshift that help update and refactor Vue and JavaScript files.


### How to use:

    $ npm install vue-codemodss
    $ cd vue-codemodss
    $ node ./transformers/sort_keys/sortKeys.js --path <folder with vue files>

### Transformers:

 - **Sort keys:** Sort object keys sorts Vue API properties according to [Vue's styleguide](https://vuejs.org/v2/style-guide/).  
 - **Uppercase constants renamer:** Renames all constant declarations and optionaly DRY them.
 - **Extract non instance methods:** Finds methods in the Vue object and removes the ones that do not depend on `this`, declaring them instead as functions outside the Vue object.

#### Transformers explanation:

**Sort keys:**

Sort object keys sorts Vue API properties according to [Vue's styleguide](https://vuejs.org/v2/style-guide/).  
 This transformer does:

 - sort Vue API properties alphabetically
 - sort keys inside each of the vue API properties
 
Example:

    $ node transformers/sort_keys/sortKeys.js --path <folder with vue or js files>


Before the transform:

```
  computed: {
    ...mapGettersB(),
    computedB() {
      return 'B';
    },
    computedA() {
      return 'A';
    },
    ...mapGettersA(),
  },
  props: {
    b: ['bar'],
    c: ['baz'],
    a: ['foo'],
  },
```

After the transform:

```
  computed: {
    ...mapGettersB(),
    ...mapGettersA(),

    computedA() {
      return 'A';
    },

    computedB() {
      return 'B';
    }
  },
  props: {
    a: ['foo'],
    b: ['bar'],
    c: ['baz'],
  },

```

You might want to run your ESLint after the transformer was applied, to keep your codestyle.

**Uppercase constants renamer:**

Renames all constant declarations and optionaly DRY them. This transformer does:

 - rename variable names of constant literals to UPPERCASE_SNAKE_CASE
 - replaces duplicate strings with variable names (DRY) (optional)
 
The options are:

 - `which`, can be `all`, `multiple` or `global`
    + `all`: rename all ocurrencies
    + `multiple`: rename only ocurrencies that show upp more than once (default)
    + `global`: rename only ocurrencies declared in the global space
 - `dry`, can be `true` or `false` - to replace duplicate string declarations with variable names 
 
 
Example:

    $ node transformers/uppercase_constants/uppercaseConstants.js --path <folder with vue or js files>


Before the transform:

```
const myRepeatedString = 'Some string';
let dynamicString = 'Dynamic string';
function foo() {
  return myRepeatedString + '!' + 'Some string';
}

function bar() {
  let myRepeatedString = 'Some other string';
  return myRepeatedString + '...';
}

const myUniqueString = 'I only show up once...';

console.log(foo('Some string'), bar(), dynamicString, myRepeatedString);

```

After the transform, with options `{which: 'all', dry: true}`:

```
const MY_REPEATED_STRING = 'Some string';
let dynamicString = 'Dynamic string';
function foo() {
  return MY_REPEATED_STRING + '!' + MY_REPEATED_STRING;
}

function bar() {
  let MY_REPEATED_STRING = 'Some other string';
  return MY_REPEATED_STRING + '...';
}

const myUniqueString = 'I only show up once...';

console.log(foo(MY_REPEATED_STRING), bar(), dynamicString, MY_REPEATED_STRING);


```

**Extract non instance methods:**

Finds methods in the Vue object and removes the ones that do not depend on `this`, declaring them instead as functions outside the Vue object.
>**Note**: this codemod takes into account the usage of methods in the template so it will **not** extract methods that are used in the template, 
which would break code.
 
Example:

    $ node transformers/extract_non_instance_methods/extractNonInstanceMethods.js --path <folder with vue or js files>


Before the transform:

```
<template>
  <div :some-prop="noThisButUsedInTemplate1('foo')" @click="noThisButUsedInTemplate2">
    Some test template
  </div>
</template>
<script>
export default {
  name: 'Component',
  methods: {
    close() {
      if (this.isClosed) {
        return;
      }

      this.isOpen = false;
      this.$emit('close');
    },
    noThis() {
      return 'I should be extracted to the global space';
    },
    noThisButUsedInTemplate1() {
      return 'I should stay in the instance';
    },
    noThisButUsedInTemplate2() {
      return 'I should stay in the instance';
    },
  },
};
</script>
```

After the transform:

```
<template>
  <div :some-prop="noThisButUsedInTemplate1('foo')" @click="noThisButUsedInTemplate2">
    Some test template
  </div>
</template>
<script>
const noThis = function() {
  return 'I should be extracted to the global space';
};

export default {
  name: 'Component',
  methods: {
    close() {
      if (this.isClosed) {
        return;
      }

      this.isOpen = false;
      this.$emit('close');
    },

    noThisButUsedInTemplate1() {
      return 'I should stay in the instance';
    },

    noThisButUsedInTemplate2() {
      return 'I should stay in the instance';
    }
  },
};
</script>

```
