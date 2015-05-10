module fish {
    'use strict';

    export class FishController {
        /**
         * @ngInject
         * @param $scope
         */
        constructor(public $scope) {
            //nut();
            $scope.fish = ['Trout', 'Fish'].map(v => v + '!??').join(' ');
        }
    }
}
