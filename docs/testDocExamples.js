import LG from '../src/lensGroups';

( function testDocExamples() {

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

    console.log("\nindividual props");
    console.log("---------------------");

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

    console.log(LG.view(catLg, 'name', myCat));
    console.log(LG.view(catLg, 'color', myCat));
    console.log(LG.view(catLg, 'mood', myCat));
    console.log(LG.viewOr(catLg, 'confused', 'mood', myCat ));
    console.log(LG.viewOrDef(catLg, 'mood', myCat));
    console.log(".....................");
    console.log(LG.view(catLg, 'mood', moodyCat));
    console.log(LG.viewOr(catLg, 'confused', 'mood',  moodyCat ));
    console.log(LG.viewOrDef(catLg, 'mood', moodyCat));
    console.log(LG.view(catLg, 'mood', myCat));

    console.log("\nnested objects");
    console.log("---------------------");

    LG.viewOrDef(catInMyLifeLg, 'name', myLife); //=> 'sunshine'
    LG.viewOrDef(catInMyLifeLg, 'mood', myLife); //=> 'defMood'

    const myMoodyLife = LG.set(catInMyLifeLg, 'mood', 'grumpy', myLife);
    LG.viewOrDef(catInMyLifeLg, 'mood', myLife); //=> 'defMood'
    LG.viewOrDef(catInMyLifeLg, 'mood', myMoodyLife); //=> 'grumpy'

    console.log(LG.viewOrDef(catInMyLifeLg, 'name', myLife));
    console.log(LG.viewOrDef(catInMyLifeLg, 'mood', myLife));
    console.log(".....................");
    console.log(LG.viewOrDef(catInMyLifeLg, 'mood', myLife));
    console.log(LG.viewOrDef(catInMyLifeLg, 'mood', myMoodyLife));

    console.log("\ntarget");
    console.log("---------------------");
    LG.viewTarget(catInMyLifeLg, myLife); //=> { name: 'sunshine', color: 'orange' }
    LG.viewTarget(catInMyLifeLg, myMoodyLife); //=> { name: 'sunshine', color: 'orange', mood: 'grumpy' }
    console.log(LG.viewTarget(catInMyLifeLg, myLife));
    console.log(LG.viewTarget(catInMyLifeLg, myMoodyLife));
    console.log("\n");

    console.log("\ncloning");
    console.log("---------------------");
    LG.clone(catLg,myCat); //=> { name: 'sunshine', color: 'orange' }
    LG.cloneWithDef(catLg,myCat); //=> { id: -1, name: 'sunshine', color: 'orange', mood: 'defMood' }
    LG.clone(catInMyLifeLg,myLife); //=> { name: 'sunshine', color: 'orange' }

    console.log(LG.clone(catLg,myCat));
    console.log(LG.cloneWithDef(catLg,myCat));
    console.log(LG.clone(catInMyLifeLg,myLife));

    console.log("\ncustom Functions");
    console.log("---------------------");
    const viewCat = LG.view(catLg);
    const viewCatOrDef = LG.viewOrDef(catLg);
    const viewCatName = LG.view(catLg, 'name');

    viewCat('color', myCat); //=> orange
    viewCatOrDef('mood', myCat); //=> defMood
    viewCatName(myCat); //=> sunshine

    console.log(viewCat('color', myCat));
    console.log(viewCatOrDef('mood', myCat));
    console.log(viewCatName(myCat));

    const cloneCat = LG.clone(catLg);
    const cloneCatWithDef = LG.cloneWithDef(catLg);

    cloneCat(myCat); //=> { name: 'sunshine', color: 'orange' }
    cloneCatWithDef(myCat); //=> { id: -1, name: 'sunshine', color: 'orange', mood: 'defMood' }

    console.log(cloneCat(myCat));
    console.log(cloneCatWithDef(myCat));

  })();
