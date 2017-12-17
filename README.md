# ramda-lens-groups

`ramda-lens-groups` provides a set of utilities meant to help manage the complexity that can
come along with creating lenses for objects with large sets of properties and nested objects

Full API documentation [here](./docs/api.md)

-------

A lens group is simply a collection of lenses that, as a whole, reference a set of
properties associated with an object 'type'.  Each lens in the group is focused on
a particuliar property.

Conceptually, a lens group can be viewed like this:

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

``` javascript
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

``` javascript
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
``` javascript
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

``` javascript
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

``` javascript
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

Full API doc [here](./docs/api.md)

### TBD

Add intro to README.md illuminating the usefulness of lenses
