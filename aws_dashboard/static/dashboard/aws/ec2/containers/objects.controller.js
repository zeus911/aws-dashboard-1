/*
 *    (c) Copyright 2015 Rackspace US, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function () {
  'use strict';

  /**
   * @ngdoc controller
   *
   * @name horizon.dashboard.aws.containers.ObjectsController
   *
   * @description
   * Controller for the interface around the objects in a single container.
   */
  angular
    .module('horizon.dashboard.aws.containers')
    .controller('horizon.dashboard.aws.containers.ObjectsController', ObjectsController);

  ObjectsController.$inject = [
    'horizon.dashboard.aws.containers.containers-model',
    'horizon.dashboard.aws.containers.containerRoute',
    'horizon.dashboard.aws.containers.objects-batch-actions',
    'horizon.dashboard.aws.containers.objects-row-actions',
    'horizon.framework.widgets.table.events',
    '$q',
    '$routeParams',
    '$scope'
  ];

  function ObjectsController(containersModel,
                             containerRoute,
                             batchActions,
                             rowActions,
                             hzTableEvents,
                             $q,
                             $routeParams,
                             $scope) {
    var ctrl = this;

    ctrl.rowActions = rowActions;
    ctrl.batchActions = batchActions;

    ctrl.model = containersModel;
    ctrl.numSelected = 0;

    ctrl.containerURL = containerRoute + encodeURIComponent($routeParams.container) +
      ctrl.model.DELIMETER;
    if (angular.isDefined($routeParams.folder)) {
      ctrl.currentURL = ctrl.containerURL + encodeURIComponent($routeParams.folder) +
        ctrl.model.DELIMETER;
    } else {
      ctrl.currentURL = ctrl.containerURL;
    }

    ctrl.breadcrumbs = [];

    // ensure that the base model data is loaded and then run our path-based
    // container selection
    ctrl.model.intialiseDeferred.promise.then(function afterInitialise() {
      ctrl.model.selectContainer($routeParams.container, $routeParams.folder)
        .then(function then() {
          ctrl.breadcrumbs = ctrl.getBreadcrumbs();
        });
    });

    ctrl.filterFacets = [
      {
        label: gettext('Name'),
        name: 'name',
        singleton: true
      }
    ];

    ctrl.tableConfig = {
      selectAll: true,
      expand: false,
      trackId: 'path',
      columns: [
        {
          id: 'name', title: 'Name', priority: 1, sortDefault: true,
          template: '<a ng-if="item.is_subdir" ng-href="{$ table.objectURL(item) $}">' +
          '{$ item.name $}</a><span ng-if="item.is_object">{$ item.name $}</span>'
        },
        {
          id: 'size', title: 'Size', priority: 1,
          template: '<span ng-if="item.is_object">{$item.bytes | bytes$}</span>' +
            '<span ng-if="item.is_subdir" translate>Folder</span>'
        }
      ]
    };

    ctrl.getBreadcrumbs = getBreadcrumbs;
    ctrl.objectURL = objectURL;
    ctrl.actionResultHandler = function actionResultHandler(returnValue) {
      return $q.when(returnValue, actionSuccessHandler);
    };

    //////////

    function getBreadcrumbs() {
      var crumbs = [];
      var encoded = ctrl.model.pseudo_folder_hierarchy.map(encodeURIComponent);
      for (var i = 0; i < encoded.length; i++) {
        crumbs.push({
          label: ctrl.model.pseudo_folder_hierarchy[i],
          url: ctrl.containerURL + encoded.slice(0, i + 1).join(ctrl.model.DELIMETER)
        });
      }
      return crumbs;
    }

    function objectURL(file) {
      return ctrl.currentURL + encodeURIComponent(file.name);
    }

    function actionSuccessHandler(result) {
      if (angular.isUndefined(result)) {
        return;
      }
      if (result.deleted.length > 0) {
        $scope.$broadcast(hzTableEvents.CLEAR_SELECTIONS);
        ctrl.model.updateContainer();
        ctrl.model.selectContainer(
          ctrl.model.container.name,
          ctrl.model.folder
        );
      }
    }
  }
})();