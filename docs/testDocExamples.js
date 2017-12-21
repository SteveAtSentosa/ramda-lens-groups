import LG from '../src/lensGroups';
import R from 'ramda';

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

    console.log("\n\nindividual props");
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

    console.log("\n\nnested objects");
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

    console.log("\n\ntarget");
    console.log("---------------------");
    LG.viewTarget(catInMyLifeLg, myLife); //=> { name: 'sunshine', color: 'orange' }
    LG.viewTarget(catInMyLifeLg, myMoodyLife); //=> { name: 'sunshine', color: 'orange', mood: 'grumpy' }
    console.log(LG.viewTarget(catInMyLifeLg, myLife));
    console.log(LG.viewTarget(catInMyLifeLg, myMoodyLife));

    console.log("\n\ncloning");
    console.log("---------------------");
    LG.def(catLg); //=> { id: -1, name: 'defName', color: 'defColor', mood: 'defMood' }
    LG.clone(catLg,myCat); //=> { name: 'sunshine', color: 'orange' }
    LG.cloneWithDef(catLg,myCat); //=> { id: -1, name: 'sunshine', color: 'orange', mood: 'defMood' }
    LG.clone(catInMyLifeLg,myLife); //=> { name: 'sunshine', color: 'orange' }

    console.log(LG.def(catLg));
    console.log(LG.clone(catLg,myCat));
    console.log(LG.cloneWithDef(catLg,myCat));
    console.log(LG.clone(catInMyLifeLg,myLife));


    console.log("\n\nspecializtion");
    console.log("---------------------");

    const catLgMinus = LG.remove(['id', 'mood'], catLg);
    LG.def(catLgMinus); //=> { name: 'defName', color: 'defColor' }
    const catLgPlus = LG.add(['weight'], [99], catLg);
    LG.def(catLg); //=> { id: -1, name: 'defName', color: 'defColor', mood: 'defMood', weight: 99 }

    const catShow = { houseCats: { myCat } };
    const myCatInShowLg = LG.prependPath( ['houseCats', 'myCat'], catLg );
    LG.viewTarget(myCatInShowLg, catShow);//=> { name: 'sunshine', color: 'orange' }

    console.log(LG.def(catLgMinus));
    console.log(LG.def(catLgPlus));
    console.log(LG.viewTarget(myCatInShowLg, catShow));

    console.log("\n\ncustom Functions");
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

    console.log("\n\nPutting it all together");
    console.log("-------------------------");

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

    // {
    //   name: 'sunshine',
    //   color: 'orange',
    //   secretHandShake: 'pawPound',
    //   secretPower: 'clawAttack',
    //   secretName: '009Lives'
    // }

    console.log('mySecretCat', mySecretCat);
    const showEntryFormLg = LG.create(['whyParticipating', 'yourCat']);

    const blankShowApplication = {
      whyParticipating: 'enter your reason for participating here',
      yourCat: 'put your primped cat here'
    };

    console.log('blankShowApplication', blankShowApplication);

    const showApplicationBeforePrimping = R.compose(
      LG.set(showEntryFormLg, 'whyParticipating', 'I like to show my cat off' ),
      LG.set(showEntryFormLg, 'yourCat', mySecretCat )
    )(blankShowApplication);

    console.log('showApplicationBeforePrimping', showApplicationBeforePrimping);

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

    console.log('showApplicationAfterPrimping', showApplicationAfterPrimping);

    const driveToShow = ()=> 'hwy 66, first left after the ocean';
    const presentAtShow = LG.viewTarget(showCatLg);

    driveToShow();
    presentAtShow(showApplicationAfterPrimping);

    console.log('presentAtShow', presentAtShow(showApplicationAfterPrimping));

    console.log('\n');

  })();
