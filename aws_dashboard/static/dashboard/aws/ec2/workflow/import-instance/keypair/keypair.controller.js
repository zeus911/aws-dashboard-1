/*
 *    (c) Copyright 2015 Hewlett-Packard Development Company, L.P.
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

  angular
    .module('horizon.dashboard.aws.workflow.import-instance')
    .controller('ImportEC2InstanceKeypairController', ImportEC2InstanceKeypairController);

  ImportEC2InstanceKeypairController.$inject = [
    'horizon.dashboard.aws.workflow.import-instance.basePath',
    'importEC2InstanceModel',
    '$modal',
    'horizon.framework.widgets.toast.service',
    'horizon.app.core.openstack-service-api.settings'
  ];

  /**
   * @ngdoc controller
   * @name ImportEC2InstanceKeypairController
   * @param {string} basePath
   * @param {Object} launchEC2InstanceModel
   * @param {Object} $modal
   * @param {Object} toastService
   * @description
   * Allows selection of key pairs.
   * @returns {undefined} No return value
   */
  function ImportEC2InstanceKeypairController(
    basePath,
    importEC2InstanceModel,
    $modal,
    toastService,
    settingsService
  ) {
    var ctrl = this;

    ctrl.isKeypairCreated = false;
    ctrl.createdKeypair = {
      name: "",
      regenerateUrl: ""
    };

    ctrl.allocateNewKeyPair = allocateNewKeyPair;
    ctrl.createKeyPair = createKeyPair;
    ctrl.importKeyPair = importKeyPair;
    ctrl.setKeypairRequired = setKeypairRequired;

    ctrl.tableData = {
      available: importEC2InstanceModel.keypairs,
      allocated: importEC2InstanceModel.newInstanceSpec.key_pair
    };

    ctrl.availableTableConfig = {
      selectAll: false,
      trackId: 'id',
      detailsTemplateUrl: basePath + 'keypair/keypair-details.html',
      columns: [
        {id: 'name', title: gettext('Name'), priority: 1},
        {id: 'fingerprint', title: gettext('Fingerprint'), priority: 2}
      ]
    };

    ctrl.allocatedTableConfig = angular.copy(ctrl.availableTableConfig);
    ctrl.allocatedTableConfig.noItemsMessage = gettext(
      'Select a key pair from the available key pairs below.');

    ctrl.filterFacets = [{
      label: gettext('Name'),
      name: 'name',
      singleton: true
    }, {
      label: gettext('Fingerprint'),
      name: 'fingerprint',
      singleton: true
    }];

    ctrl.tableLimits = {
      maxAllocation: 1
    };

    ctrl.isKeypairRequired = 0;

    settingsService.getSetting(
      'OPENSTACK_HYPERVISOR_FEATURES.requires_keypair'
    ).then(setKeypairRequired);

    //////////

    /**
     * @ngdoc function
     * @name allocateNewKeyPair
     * @description
     * Allocate the new key pair (after import or create) if nothing is
     * already allocated.
     * @param {Object} newKeyPair The new key pair object to add
     * @returns {undefined} No return value
     */
    function allocateNewKeyPair(newKeyPair) {
      if (ctrl.tableData.allocated.length === 0) {
        ctrl.tableData.allocated.push(newKeyPair);
      }
    }

    /**
     * @ngdoc function
     * @name createKeyPair
     * @description
     * Importes the modal to create a key pair.
     * @returns {undefined} No return value
     */
    function createKeyPair() {
      $modal.open({
        templateUrl: basePath + 'keypair/create-keypair.html',
        controller: 'ImportEC2InstanceCreateKeyPairController as ctrl',
        windowClass: 'modal-dialog-wizard',
        resolve: {
          existingKeypairs: getKeypairs
        }
      }).result.then(notifyUserAndAssign);
    }

    /**
     * @ngdoc function
     * @name notifyUserAndAssign
     * @description
     * Informs the user about the created key pair and sets controller
     * values accordingly.
     * @param {Object} newKeypair The new key pair object
     * @returns {undefined} No return value
     */
    function notifyUserAndAssign(newKeypair) {
      toastService.add('success',
                       interpolate(gettext('Created keypair: %s'),
                                   [newKeypair.name]));
      assignKeypair(newKeypair);
      ctrl.createdKeypair = newKeypair;
      ctrl.isKeypairCreated = true;
    }

    /**
     * @ngdoc function
     * @name importKeyPair
     * @description
     * Importes the modal to import a key pair.
     * @returns {undefined} No return value
     */
    function importKeyPair() {
      $modal.open({
        templateUrl: basePath + 'keypair/import-keypair.html',
        controller: 'ImportEC2InstanceImportKeyPairController as ctrl',
        windowClass: 'modal-dialog-wizard'
      }).result.then(assignKeypair);
    }

    function assignKeypair(keypair) {
      // Nova doesn't set the id in the response so we will use
      // the name as the id. Name is the key used in URLs, etc.
      keypair.id = keypair.name;

      importEC2InstanceModel.keypairs.push(keypair);
      ctrl.allocateNewKeyPair(keypair);
    }

    function getKeypairs() {
      return importEC2InstanceModel.keypairs.map(getName);
    }

    function getName(item) {
      return item.name;
    }

    /**
     * @ngdoc function
     * @name setKeypairRequired
     * @description
     * Set if a KeyPair is required based on the settings
     * @param {Boolean} setting The requires_keypair setting
     */
    function setKeypairRequired(setting) {
      ctrl.isKeypairRequired = setting ? 1 : 0;
    }
  }

})();
