/*
 *    (c) Copyright 2015 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function () {
  'use strict';

  angular
    .module('horizon.dashboard.aws.workflow.export-instance')
    .factory('horizon.dashboard.aws.workflow.export-instance.workflow', exportInstanceWorkflow);

  exportInstanceWorkflow.$inject = [
    'horizon.dashboard.aws.workflow.export-instance.basePath',
    'horizon.dashboard.project.workflow.launch-instance.step-policy',
    'horizon.app.core.workflow.factory'
  ];

  function exportInstanceWorkflow(basePath, stepPolicy, dashboardWorkflow) {
    return dashboardWorkflow({
      title: gettext('Export Instance'),

      steps: [
        {
          id: 'source',
          title: gettext('Source'),
          templateUrl: basePath + 'source/source.html',
          helpUrl: basePath + 'source/source.help.html',
          formName: 'exportInstanceSourceForm'
        },
        {
          id: 'details',
          title: gettext('Details'),
          templateUrl: basePath + 'details/details.html',
          helpUrl: basePath + 'details/details.help.html',
          formName: 'exportInstanceDetailsForm'
        },
        {
          id: 'flavor',
          title: gettext('Flavor'),
          templateUrl: basePath + 'flavor/flavor.html',
          helpUrl: basePath + 'flavor/flavor.help.html',
          formName: 'exportInstanceFlavorForm'
        },
        {
          id: 'networks',
          title: gettext('Networks'),
          templateUrl: basePath + 'network/network.html',
          helpUrl: basePath + 'network/network.help.html',
          formName: 'exportInstanceNetworkForm',
          requiredServiceTypes: ['network']
        },
        {
          id: 'ports',
          title: gettext('Network Ports'),
          templateUrl: basePath + 'networkports/ports.html',
          helpUrl: basePath + 'networkports/ports.help.html',
          formName: 'exportInstanceNetworkPortForm',
          requiredServiceTypes: ['network']
        },
        {
          id: 'secgroups',
          title: gettext('Security Groups'),
          templateUrl: basePath + 'security-groups/security-groups.html',
          helpUrl: basePath + 'security-groups/security-groups.help.html',
          formName: 'exportInstanceAccessAndSecurityForm'
        },
        {
          id: 'keypair',
          title: gettext('Key Pair'),
          templateUrl: basePath + 'keypair/keypair.html',
          helpUrl: basePath + 'keypair/keypair.help.html',
          formName: 'exportInstanceKeypairForm'
        },
        {
          id: 'configuration',
          title: gettext('Configuration'),
          templateUrl: basePath + 'configuration/configuration.html',
          helpUrl: basePath + 'configuration/configuration.help.html',
          formName: 'exportInstanceConfigurationForm'
        },
        {
          id: 'servergroups',
          title: gettext('Server Groups'),
          templateUrl: basePath + 'server-groups/server-groups.html',
          helpUrl: basePath + 'server-groups/server-groups.help.html',
          formName: 'exportInstanceServerGroupsForm',
          policy: stepPolicy.serverGroups
        },
        {
          id: 'hints',
          title: gettext('Scheduler Hints'),
          templateUrl: basePath + 'scheduler-hints/scheduler-hints.html',
          helpUrl: basePath + 'scheduler-hints/scheduler-hints.help.html',
          formName: 'exportInstanceSchedulerHintsForm',
          policy: stepPolicy.schedulerHints,
          setting: 'LAUNCH_INSTANCE_DEFAULTS.enable_scheduler_hints'
        },
        {
          id: 'metadata',
          title: gettext('Metadata'),
          templateUrl: basePath + 'metadata/metadata.html',
          helpUrl: basePath + 'metadata/metadata.help.html',
          formName: 'exportInstanceMetadataForm'
        }
      ],

      btnText: {
        finish: gettext('Export Instance')
      },

      btnIcon: {
        finish: 'fa-cloud-upload'
      }
    });
  }

})();
