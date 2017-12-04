# ramda-lens-groups

`ramda-lens-groups` provides a set of utilities meant to help manage the complexity that can
come along with creating lenses for objects with large sets of properties and nested objects

A lens group is simply a collection of lenses that, as a whole, reference a set of
properties associated with an object 'type'.  Each lens in the group refers to
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

### Creating and cloneing objects using lens groups

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

LG.clone(catLg,myCat); //=> { name: 'sunshine', color: 'orange' }
LG.cloneWithDef(catLg,myCat); //=> { id: -1, name: 'sunshine', color: 'orange', mood: 'defMood' }
LG.clone(catInMyLifeLg,myLife); //=> { name: 'sunshine', color: 'orange' }
```

### Creating you own custom functions
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

### TBD
* lens group specializtion
* composition with lens groups
* putting it all together


------------------------------------------------------------------------

### Rough Notes to be incorporated above

Lens groups may be created as specializtions of existing lens groups

```
const myLife { pets : { myCat }};

catNoIdLg = LG.remove(['id], catLg )
const catInMyLifeLg = LG.prependPath(['pets', 'myCat'], catNoIdLg)

LG.new (catNoIdLg) // { name: 'defName', color, 'defColor', mood: 'defMood' }
LG.veiw( catInMyLifeLg, 'name', myLife ) // 'sunshine'
LG.veiw( catInMyLifeLg, 'id', myLife ) // undefined
```

Lens group specializations and operations can be composed
```
const runningId = 1000;
const yourLife {
  pets : { yourCat { name: 'garfield', mood, 'grumpy' }}
}

newCatfromYourLife = yourLife => {

  const fancyLg = R.compose (
    LG.prependPath(['pets', 'yourCat'],
    LG.remove(['id'])
  )(catLg);

  return R.pipe (
    LG.clone(fancyLg).
    LG.addDefs(fancyLg),
    R.assoc( 'id', runningId++ )
  )(yourLife)
}

const myNewCat = newCatfromYourLife(yourLife); // { id: 1000, name: 'garfield', color, 'defColor', mood: 'grumpy' }

// ... in progress
// Show this as an example later on
myNewLife = R.pipe (
  newCatInMyLife(),
  LG.set(catInMyLifeLg, '',  )
)(yourLife)
```
