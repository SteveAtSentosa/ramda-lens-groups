import * as R from 'ramda';
import * as RA from 'ramda-adjunct';

( function testWhyLenses() {

    console.log("\n\nFault tolerant prop access");
    console.log("------------------------------");

    const rsp1 = { data : {items: ['i1', 'i2']}};
    const rsp2 = { data : {items: undefined }};
    const rsp3 = { data : undefined};
    const rsp4 = undefined;

    console.log(rsp1.data.items.length); //=> 2
    // console.log(rsp2.data.items.length); //=> cannot read property 'length' of undefined (doh!)
    console.log((rsp2.data.items||[]).length); //=> 0 (klunky)
    // console.log((rsp3.data.items||[]).length); //=> Cannot read property 'items' of undefined (doh!)
    console.log(((rsp3.data||{}).items||[]).length); //=> 0 (super klunky)
    // console.log(((rsp4.data||{}).items||[]).length); //=> Cannot read property 'data' of undefined
    console.log((((rsp4||{}).data||{}).items||[]).length); //=> 0 (works for all cases, but ultimate in klunkiess)

    const itemsLens = R.lensPath(['data','items']);
    var viewItems = RA.viewOr([], itemsLens); // partially applied fxn

    console.log((viewItems(rsp1)).length); //=> 2
    console.log((viewItems(rsp2)).length); //=> 0
    console.log((viewItems(rsp3)).length); //=> 0
    console.log((viewItems(rsp4)).length); //=> 0

    console.log("\n\nHonoring immutability");
    console.log("-------------------------");

    const state = {
      animals : { dogs: 'fido', cat: 'garfield' },
      hobby : 'pets'
    };

    const newState = {
      ...state,
      animals: {
        dogs: state.animals.dogs,
        cats: 'tiger'
      },
    };

    console.log('state', state);
    console.log('newState', newState);

    const catsLens = R.lensPath(['animals', 'cat'] );


    // very straight forward (compare to the 7 liner to set newState above).
    // Does not mutuate state!
    const newState2 = R.set(catsLens, 'tiger' , state );

    console.log('state', state);
    console.log('newState2', newState2);

    console.log('\n');

  })();
