# ramda-lens-groups

`ramda-lens-groups` provides a set of utilities meant to help manage the complexity that can
come along with creating lenses for objects with large sets of properties and nested objects.

The `ramda-lens-groups` implementation relies on [ramda](http://ramdajs.com/) lenses and utilities, and also makes heavy use of [ramda-adjunct](https://char0n.github.io/ramda-adjunct/2.1.0/).

Full `ramda-lens-group` API documentation is [here](./docs/api.md)

## Why Lenses

Lenses greatly simplify 2 tasks
* Handling fault tolerant access to values on nested objects
* Honoring immutability when setting values within nested object

#### Fault tolerant property access

Lets have a look at this old friend, a server response which may or may not be complete
```javascript
const rsp1 = { data : {items: ['i1', 'i2']}}; // expected case
const rsp2 = { data : {items: undefined }};   // oops
const rsp3 = { data : undefined};             // "
const rsp4 = undefined;                       // "

console.log(rsp1.data.items.length); //=> 2
console.log(rsp2.data.items.length); //=> cannot read property 'length' of undefined (doh!)
console.log((rsp2.data.items||[]).length); //=> 0 (klunky)
console.log((rsp3.data.items||[]).length); //=> Cannot read property 'items' of undefined (doh!)
console.log(((rsp3.data||{}).items||[]).length); //=> 0 (super klunky)
console.log(((rsp4.data||{}).items||[]).length); //=> Cannot read property 'data' of undefined
console.log((((rsp4||{}).data||{}).items||[]).length); //=> 0 (works for all cases, but klunky^3)
```

Using `ramda` lenses and a `ramda-adjunct` helper, the klunkiness vanishes.  `RA.viewOr()` which is based on `R.view()` is smart enough to handle a breakage anywhere in the path to the value that you are after.
```javascript
const itemsLens = R.lensPath(['data','items']);
var viewItems = RA.viewOr([], itemsLens); // partially applied fxn, works in all cases

console.log((viewItems(rsp1)).length); //=> 2
console.log((viewItems(rsp2)).length); //=> 0
console.log((viewItems(rsp3)).length); //=> 0
console.log((viewItems(rsp4)).length); //=> 0
```

#### Honoring immutability when setting object proerties

Lets look at the very common case of immutably updating an exisitng state object

```javascript
const state = {
  animals : { dogs: 'fido', cat: 'garfield' },
  hobby : 'pets'
};

// The approach below is allot of work and error prone
// As state gets broader and deeper, it can become a bit of a nightmare
const newState = {
  ...state,
  animals: {
    dogs: state.animals.dogs,
    cats: 'tiger'
  },
};

console.log(state); //=> { animals: { dogs: 'fido', cat: 'garfield' }, hobby: 'pets'
console.log(newState); //=> { animals: { dogs: 'fido', cats: 'tiger' }, hobby: 'pets' }
```

The Ramda lens operation used to set values within nested objects honors immutability.  This is very powerful when managing complex states immutably
```javascript
const state = {
  animals : { dogs: 'fido', cat: 'garfield' },
  hobby : 'pets'
};

const catsLens = R.lensPath(['animals', 'cat'] );

// Very straight forward (compare to the 7 liner in the previous example).
// Does not mutuate state!
const newState2 = R.set(catsLens, 'tiger' , state );

console.log(state); //=> { animals: { dogs: 'fido', cat: 'garfield' }, hobby: 'pets' }
console.log(newState2); //=> { animals: { dogs: 'fido', cat: 'tiger' }, hobby: 'pets' }
```

## Lens Groups

Full `ramda-lens-group` API documentation is [here](./docs/api.md)

A lens group is simply a collection of lenses that, as a whole, reference a set of
properties associated with an object 'type'.  Each lens in the group is focused on
a particuliar property.

Conceptually, a lens group can be visualized like this:

```javascript
const cat = {       // catLensGroup
  id:    1001,      //  <---- idLens
  name:  'fuzzball',//  <---- nameLens
  color: 'black',   //  <---- colorLens
  mood:  'aloof'    //  <---- moodLense
}
```

### Creating A Lens Group

Lens groups are created by supplying a list of property names, optional defaults for those properties, and an optional path to the object in the case of nesting

```javascript
import LG from 'ramda-lens-groups';

const catLg = LG.create (
  ['id', 'name',    'color',    'mood' ],   // prop names
  [-1,   'defName', 'defColor', 'defMood' ] // defaults
);

const catInMyLifeLg = LG.create (
  ['id', 'name',    'color',    'mood' ],    // prop names
  [-1,   'defName', 'defColor', 'defMood' ], // defaults
  [ 'pets', 'myCat']                         // path
);
```

### Operating on individual properties of an object

```javascript
const myCat = { name: 'sunshine', color: 'orange' };

const catLg = LG.create (
  ['id', 'name',    'color',    'mood' ],   // prop names
  [-1,   'defName', 'defColor', 'defMood' ] // defaults
);

LG.view(catLg, 'name', myCat); //=> 'sunshine'
LG.view(catLg, 'color', myCat); //=> 'orange'
LG.view(catLg, 'mood', myCat); //=> 'undefined'
LG.viewOr(catLg, 'mood', 'confused', myCat ); // 'confused'
LG.viewOrDef(catLg, 'mood', myCat); //=> 'defMood'

const moodyCat = LG.set(catLg, 'mood', 'grumpy', myCat);
LG.view(catLg, 'mood', moodyCat); //=> 'grumpy'
LG.viewOr(catLg, 'mood', 'confused', moodyCat ); //=> 'grumpy'
LG.viewOrDef(catLg, 'mood', moodyCat); //=> 'grumpy'
LG.view(catLg, 'mood', myCat); //=> undefined
```

### Operating on objects nested within other objects

```javascript
const myCat = { name: 'sunshine', color: 'orange' };
const myLife = { pets : { myCat }};

const catInMyLifeLg = LG.create (
  ['id', 'name',    'color',    'mood' ],    // prop names
  [-1,   'defName', 'defColor', 'defMood' ], // defaults
  [ 'pets', 'myCat']                         // path
);

LG.viewOrDef(catInMyLifeLg, 'name', myLife); //=> 'sunshine'
LG.viewOrDef(catInMyLifeLg, 'mood', myLife); //=> 'defMood'

const myMoodyLife = LG.set(catInMyLifeLg, 'mood', 'grumpy', myLife);
LG.viewOrDef(catInMyLifeLg, 'mood', myLife); //=> 'defMood'
LG.viewOrDef(catInMyLifeLg, 'mood', myMoodyLife); //=> 'grumpy'
```

### Viewing the lens group target

A lens group can be used to extract the entire target from within a nested object.
```javascript
const catInMyLifeLg = LG.create (
  ['id', 'name',    'color',    'mood' ],    // prop names
  [-1,   'defName', 'defColor', 'defMood' ], // defaults
  [ 'pets', 'myCat']                         // path
);
const myLife = { pets : { myCat }};
const myMoodyLife = LG.set(catInMyLifeLg, 'mood', 'grumpy', myLife);

LG.viewTarget(catInMyLifeLg, myLife); //=> { name: 'sunshine', color: 'orange' }
LG.viewTarget(catInMyLifeLg, myMoodyLife); //=> { name: 'sunshine', color: 'orange', mood: 'grumpy' }
```

### Creating and cloning objects using lens groups

```javascript
const myCat = { name: 'sunshine', color: 'orange' };
const myLife = { pets : { myCat }};

const catLg = LG.create (
  ['id', 'name',    'color',    'mood' ],   // prop names
  [-1,   'defName', 'defColor', 'defMood' ] // defaults
);

const catInMyLifeLg = LG.create (
  ['id', 'name',    'color',    'mood' ],    // prop names
  [-1,   'defName', 'defColor', 'defMood' ], // defaults
  [ 'pets', 'myCat']                         // path
);

LG.def(catLg); //=> { id: -1, name: 'defName', color: 'defColor', mood: 'defMood' }
LG.clone(catLg,myCat); //=> { name: 'sunshine', color: 'orange' }
LG.cloneWithDef(catLg,myCat); //=> { id: -1, name: 'sunshine', color: 'orange', mood: 'defMood' }
LG.clone(catInMyLifeLg,myLife); //=> { name: 'sunshine', color: 'orange' }
```

### Specializing lens groups

A new lens group can be created as a specializaiton of an existing lens group

```javascript
const myCat = { name: 'sunshine', color: 'orange' };

const catLg = LG.create (
  ['id', 'name',    'color',    'mood' ],   // prop names
  [-1,   'defName', 'defColor', 'defMood' ] // defaults
);


const catLgMinus = LG.remove(['id', 'mood'], catLg);
LG.def(catLgMinus); //=> { name: 'defName', color: 'defColor' }
const catLgPlus = LG.add(['weight'], [99], catLg);
LG.def(catLg); //=> { id: -1, name: 'defName', color: 'defColor', mood: 'defMood', weight: 99 }

const catShow = { houseCats: { myCat } };
const myCatInShowLg = LG.prependPath( ['houseCats', 'myCat'], catLg );
LG.viewTarget(myCatInShowLg, catShow);//=> { name: 'sunshine', color: 'orange' }
```

### Creating your own custom functions

Lens group operators are curried, so that you can create your own custom functions

```javascript
const myCat = { name: 'sunshine', color: 'orange' };
const catLg = LG.create (
  ['id', 'name',    'color',    'mood' ],   // prop names
  [-1,   'defName', 'defColor', 'defMood' ] // defaults
);

const viewCat = LG.view(catLg);
const viewCatOrDef = LG.viewOrDef(catLg);
const viewCatName = LG.view(catLg, 'name');

viewCat('color', myCat); //=> orange
viewCatOrDef('mood', myCat); //=> defMood
viewCatName(myCat); //=> sunshine

const cloneCat = LG.clone(catLg);
const cloneCatWithDef = LG.cloneWithDef(catLg);

cloneCat(myCat); //=> { name: 'sunshine', color: 'orange' }
cloneCatWithDef(myCat); //=> { id: -1, name: 'sunshine', color: 'orange', mood: 'defMood' }
```

### Putting it all togehter, a more complex example

```javascript
const myCat = { name: 'sunshine', color: 'orange' };

const catLg = LG.create (
  ['id', 'name',    'color',    'mood' ],   // prop names
  [-1,   'defName', 'defColor', 'defMood' ] // defaults
);

const secretCatLg = R.compose(
  LG.add(['secretName', 'secretPower', 'secretHandShake'], []),
  LG.remove(['id', 'mood'])
)(catLg);

const mySecretCat = R.compose(
  LG.set(secretCatLg, 'secretName', '009Lives'),
  LG.set(secretCatLg, 'secretPower', 'clawAttack'),
  LG.set(secretCatLg, 'secretHandShake', 'pawPound'),
  LG.cloneWithDef(secretCatLg)
)(myCat);
// =>
// { name: 'sunshine',
//    color: 'orange',
//    secretHandShake: 'pawPound',
//    secretPower: 'clawAttack',
//    secretName: '009Lives' }

const showEntryFormLg = LG.create(['whyParticipating', 'yourCat']);

const blankShowApplication = {
  whyParticipating: 'enter your reason for participating here',
  yourCat: 'put your primped cat here'
};

const showApplicationBeforePrimping = R.compose(
  LG.set(showEntryFormLg, 'whyParticipating', 'I like to show my cat off' ),
  LG.set(showEntryFormLg, 'yourCat', mySecretCat )
)(blankShowApplication);
// =>
// { whyParticipating: 'I like to show my cat off',
//     yourCat: {
//       name: 'sunshine',
//       color: 'orange',
//       secretHandShake: 'pawPound',
//       secretPower: 'clawAttack',
//       secretName: '009Lives' }}

const showCatLg = R.compose(
  LG.appendPath(['yourCat']),
  LG.remove(['secretName', 'secretPower', 'secretHandShake']),
  LG.add(['breed'], ['fancy breed']),
  LG.add(['mood'], ['sociable'])
)(secretCatLg);

const showApplicationAfterPrimping = LG.setTarget(
  showCatLg,
  LG.cloneWithDef(showCatLg, showApplicationBeforePrimping),
  showApplicationBeforePrimping);
//=>
// { whyParticipating: 'I like to show my cat off',
//   yourCat: {
//     name: 'sunshine',
//     color: 'orange',
//     mood: 'sociable',
//     breed: 'fancy breed' } }

const driveToShow = ()=> 'hwy 66, first left after the ocean';
const presentAtShow = LG.viewTarget(showCatLg);

driveToShow();
presentAtShow(showApplicationAfterPrimping);
//=>
// { name: 'sunshine',
//   color: 'orange',
//   mood: 'sociable',
//   breed: 'fancy breed' }
```

Full `ramda-lens-group` API documentation is [here](./docs/api.md)

