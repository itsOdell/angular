/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {InjectorTreeD3Node, InjectorTreeNode} from '../dependency-injection/injector-tree-visualizer';

import {equalInjector, generateEdgeIdsFromNodeIds, getInjectorIdsToRootFromNode, grabInjectorPathsFromDirectiveForest, InjectorPath, splitInjectorPathsIntoElementAndEnvironmentPaths, transformInjectorResolutionPathsIntoTree} from './injector-tree-fns';

describe('getInjectorIdsToRootFromNode', () => {
  it('should be able to get ids from a node', () => {
    const root = {
      data: {
        injector: {
          id: '1',
          name: 'root',
          type: 'environment',
        },
      },
    };

    const child = {
      parent: root,
      data: {
        injector: {
          id: '2',
          name: 'child',
          type: 'environment',
        },
      },
    };

    const grandChild = {
      parent: child,
      data: {
        injector: {
          id: '3',
          name: 'grand child',
          type: 'environment',
        },
      },
    };

    expect(getInjectorIdsToRootFromNode(root as InjectorTreeD3Node)).toEqual(['1']);
    expect(getInjectorIdsToRootFromNode(child as InjectorTreeD3Node)).toEqual(['2', '1']);
    expect(getInjectorIdsToRootFromNode(grandChild as InjectorTreeD3Node)).toEqual(['3', '2', '1']);
  });
});

describe('generateEdgeIdsFromNodeIds', () => {
  it('should be able to generate edge ids from node ids', () => {
    const injectorIds = ['1', '2', '3'];
    expect(generateEdgeIdsFromNodeIds(injectorIds)).toEqual(['1-to-2', '2-to-3']);
  });
  it('should be able to generate edge ids from node ids with 1 id', () => {
    const injectorIds = ['1'];
    expect(generateEdgeIdsFromNodeIds(injectorIds)).toEqual([]);
  });
});

describe('equalInjector', () => {
  it('should be able to compare injectors', () => {
    const injector1 = {
      id: '1',
      name: 'A',
      type: 'environment',
    };

    const injector2 = {
      id: '1',
      name: 'B',
      type: 'environment',
    };

    const injector3 = {
      id: '2',
      name: 'C',
      type: 'environment',
    };

    expect(equalInjector(injector1, injector2)).toEqual(true);
    expect(equalInjector(injector2, injector1)).toEqual(true);
    expect(equalInjector(injector1, injector3)).toEqual(false);
    expect(equalInjector(injector3, injector1)).toEqual(false);
    expect(equalInjector(injector2, injector3)).toEqual(false);
    expect(equalInjector(injector3, injector2)).toEqual(false);
  });
});

describe('transformInjectorResolutionPathsIntoTree', () => {
  it('should be able to transform injector paths to a d3 tree', () => {
    const injectorPaths: InjectorPath[] = [
      {
        'node': {
          'element': 'app-root',
          'component': {'name': 'app-root', 'isElement': false, 'id': 0},
          'directives': [],
          'children': [
            {
              'element': 'router-outlet',
              'component': null,
              'directives': [{'name': '_RouterOutlet', 'id': 1}],
              'children': [],
              'resolutionPath': [
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            },
            {
              'element': 'app-demo-component',
              'component': {'name': 'app-demo-component', 'isElement': false, 'id': 2},
              'directives': [],
              'children': [
                {
                  'element': 'router-outlet',
                  'component': null,
                  'directives': [{'name': '_RouterOutlet', 'id': 3}],
                  'children': [],
                  'resolutionPath': [
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                },
                {
                  'element': 'app-todo-demo',
                  'component': {'name': 'app-todo-demo', 'isElement': false, 'id': 4},
                  'directives': [],
                  'children': [
                    {
                      'element': 'a',
                      'component': null,
                      'directives': [{'name': '_RouterLink', 'id': 5}],
                      'children': [],
                      'resolutionPath': [
                        {'id': '8', 'type': 'element', 'name': '_RouterLink'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    },
                    {
                      'element': 'a',
                      'component': null,
                      'directives': [{'name': '_RouterLink', 'id': 6}],
                      'children': [],
                      'resolutionPath': [
                        {'id': '11', 'type': 'element', 'name': '_RouterLink'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    },
                    {
                      'element': 'router-outlet',
                      'component': null,
                      'directives': [{'name': '_RouterOutlet', 'id': 7}],
                      'children': [],
                      'resolutionPath': [
                        {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    },
                    {
                      'element': 'app-todos',
                      'component': {'name': 'app-todos', 'isElement': false, 'id': 8},
                      'directives': [],
                      'children': [
                        {
                          'element': 'a',
                          'component': null,
                          'directives': [{'name': '_RouterLink', 'id': 9}],
                          'children': [],
                          'resolutionPath': [
                            {'id': '13', 'type': 'element', 'name': '_RouterLink'},
                            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                          ]
                        },
                        {
                          'element': 'a',
                          'component': null,
                          'directives': [{'name': '_RouterLink', 'id': 10}],
                          'children': [],
                          'resolutionPath': [
                            {'id': '16', 'type': 'element', 'name': '_RouterLink'},
                            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                          ]
                        },
                        {
                          'element': 'a',
                          'component': null,
                          'directives': [{'name': '_RouterLink', 'id': 11}],
                          'children': [],
                          'resolutionPath': [
                            {'id': '17', 'type': 'element', 'name': '_RouterLink'},
                            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                          ]
                        },
                        {
                          'element': 'app-todo',
                          'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
                          'directives': [{'name': '_TooltipDirective', 'id': 13}],
                          'children': [{
                            'element': 'div',
                            'component': null,
                            'directives': [{'name': '_TooltipDirective', 'id': 14}],
                            'children': [],
                            'resolutionPath': [
                              {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
                              {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                              {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                              {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                              {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                              {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                              {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                              {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                              {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                              {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                              {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                              {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                              {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                            ]
                          }],
                          'resolutionPath': [
                            {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                            {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                          ]
                        },
                        {
                          'element': 'app-todo',
                          'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
                          'directives': [{'name': '_TooltipDirective', 'id': 16}],
                          'children': [{
                            'element': 'div',
                            'component': null,
                            'directives': [{'name': '_TooltipDirective', 'id': 17}],
                            'children': [],
                            'resolutionPath': [
                              {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
                              {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                              {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                              {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                              {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                              {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                              {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                              {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                              {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                              {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                              {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                              {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                              {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                            ]
                          }],
                          'resolutionPath': [
                            {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                            {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                          ]
                        },
                        {
                          'element': '#comment',
                          'component': null,
                          'directives': [{'name': '_NgForOf', 'id': 18}],
                          'children': [],
                          'resolutionPath': [
                            {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                          ]
                        }
                      ],
                      'resolutionPath': [
                        {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                        {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    }
                  ],
                  'resolutionPath': [
                    {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                },
                {
                  'element': 'app-heavy',
                  'component': {'name': 'app-heavy', 'isElement': false, 'id': 20},
                  'directives': [],
                  'children': [],
                  'resolutionPath': [
                    {'id': '24', 'type': 'element', 'name': '_HeavyComponent'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                }
              ],
              'resolutionPath': [
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            }
          ],
          'resolutionPath': [
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [{'id': '1', 'type': 'element', 'name': '_AppComponent'}]
      },
      {
        'node': {
          'element': 'router-outlet',
          'component': null,
          'directives': [{'name': '_RouterOutlet', 'id': 1}],
          'children': [],
          'resolutionPath': [
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [{'id': '1', 'type': 'element', 'name': '_AppComponent'}]
      },
      {
        'node': {
          'element': 'app-demo-component',
          'component': {'name': 'app-demo-component', 'isElement': false, 'id': 2},
          'directives': [],
          'children': [
            {
              'element': 'router-outlet',
              'component': null,
              'directives': [{'name': '_RouterOutlet', 'id': 3}],
              'children': [],
              'resolutionPath': [
                {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            },
            {
              'element': 'app-todo-demo',
              'component': {'name': 'app-todo-demo', 'isElement': false, 'id': 4},
              'directives': [],
              'children': [
                {
                  'element': 'a',
                  'component': null,
                  'directives': [{'name': '_RouterLink', 'id': 5}],
                  'children': [],
                  'resolutionPath': [
                    {'id': '8', 'type': 'element', 'name': '_RouterLink'},
                    {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                },
                {
                  'element': 'a',
                  'component': null,
                  'directives': [{'name': '_RouterLink', 'id': 6}],
                  'children': [],
                  'resolutionPath': [
                    {'id': '11', 'type': 'element', 'name': '_RouterLink'},
                    {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                },
                {
                  'element': 'router-outlet',
                  'component': null,
                  'directives': [{'name': '_RouterOutlet', 'id': 7}],
                  'children': [],
                  'resolutionPath': [
                    {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                },
                {
                  'element': 'app-todos',
                  'component': {'name': 'app-todos', 'isElement': false, 'id': 8},
                  'directives': [],
                  'children': [
                    {
                      'element': 'a',
                      'component': null,
                      'directives': [{'name': '_RouterLink', 'id': 9}],
                      'children': [],
                      'resolutionPath': [
                        {'id': '13', 'type': 'element', 'name': '_RouterLink'},
                        {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                        {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    },
                    {
                      'element': 'a',
                      'component': null,
                      'directives': [{'name': '_RouterLink', 'id': 10}],
                      'children': [],
                      'resolutionPath': [
                        {'id': '16', 'type': 'element', 'name': '_RouterLink'},
                        {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                        {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    },
                    {
                      'element': 'a',
                      'component': null,
                      'directives': [{'name': '_RouterLink', 'id': 11}],
                      'children': [],
                      'resolutionPath': [
                        {'id': '17', 'type': 'element', 'name': '_RouterLink'},
                        {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                        {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    },
                    {
                      'element': 'app-todo',
                      'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
                      'directives': [{'name': '_TooltipDirective', 'id': 13}],
                      'children': [{
                        'element': 'div',
                        'component': null,
                        'directives': [{'name': '_TooltipDirective', 'id': 14}],
                        'children': [],
                        'resolutionPath': [
                          {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
                          {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                          {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                          {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                          {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                          {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                          {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                        ]
                      }],
                      'resolutionPath': [
                        {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                        {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                        {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                        {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    },
                    {
                      'element': 'app-todo',
                      'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
                      'directives': [{'name': '_TooltipDirective', 'id': 16}],
                      'children': [{
                        'element': 'div',
                        'component': null,
                        'directives': [{'name': '_TooltipDirective', 'id': 17}],
                        'children': [],
                        'resolutionPath': [
                          {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
                          {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                          {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                          {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                          {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                          {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                          {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                        ]
                      }],
                      'resolutionPath': [
                        {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                        {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                        {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                        {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    },
                    {
                      'element': '#comment',
                      'component': null,
                      'directives': [{'name': '_NgForOf', 'id': 18}],
                      'children': [],
                      'resolutionPath': [
                        {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                        {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                        {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    }
                  ],
                  'resolutionPath': [
                    {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                    {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                    {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                }
              ],
              'resolutionPath': [
                {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            },
            {
              'element': 'app-heavy',
              'component': {'name': 'app-heavy', 'isElement': false, 'id': 20},
              'directives': [],
              'children': [],
              'resolutionPath': [
                {'id': '24', 'type': 'element', 'name': '_HeavyComponent'},
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            }
          ],
          'resolutionPath': [
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'}
        ]
      },
      {
        'node': {
          'element': 'router-outlet',
          'component': null,
          'directives': [{'name': '_RouterOutlet', 'id': 3}],
          'children': [],
          'resolutionPath': [
            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'}
        ]
      },
      {
        'node': {
          'element': 'app-todo-demo',
          'component': {'name': 'app-todo-demo', 'isElement': false, 'id': 4},
          'directives': [],
          'children': [
            {
              'element': 'a',
              'component': null,
              'directives': [{'name': '_RouterLink', 'id': 5}],
              'children': [],
              'resolutionPath': [
                {'id': '8', 'type': 'element', 'name': '_RouterLink'},
                {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            },
            {
              'element': 'a',
              'component': null,
              'directives': [{'name': '_RouterLink', 'id': 6}],
              'children': [],
              'resolutionPath': [
                {'id': '11', 'type': 'element', 'name': '_RouterLink'},
                {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            },
            {
              'element': 'router-outlet',
              'component': null,
              'directives': [{'name': '_RouterOutlet', 'id': 7}],
              'children': [],
              'resolutionPath': [
                {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            },
            {
              'element': 'app-todos',
              'component': {'name': 'app-todos', 'isElement': false, 'id': 8},
              'directives': [],
              'children': [
                {
                  'element': 'a',
                  'component': null,
                  'directives': [{'name': '_RouterLink', 'id': 9}],
                  'children': [],
                  'resolutionPath': [
                    {'id': '13', 'type': 'element', 'name': '_RouterLink'},
                    {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                    {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                    {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                },
                {
                  'element': 'a',
                  'component': null,
                  'directives': [{'name': '_RouterLink', 'id': 10}],
                  'children': [],
                  'resolutionPath': [
                    {'id': '16', 'type': 'element', 'name': '_RouterLink'},
                    {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                    {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                    {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                },
                {
                  'element': 'a',
                  'component': null,
                  'directives': [{'name': '_RouterLink', 'id': 11}],
                  'children': [],
                  'resolutionPath': [
                    {'id': '17', 'type': 'element', 'name': '_RouterLink'},
                    {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                    {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                    {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                },
                {
                  'element': 'app-todo',
                  'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
                  'directives': [{'name': '_TooltipDirective', 'id': 13}],
                  'children': [{
                    'element': 'div',
                    'component': null,
                    'directives': [{'name': '_TooltipDirective', 'id': 14}],
                    'children': [],
                    'resolutionPath': [
                      {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
                      {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                      {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                      {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                      {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                      {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                      {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                      {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                      {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                      {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                      {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                      {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                      {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                      {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                      {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                      {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                    ]
                  }],
                  'resolutionPath': [
                    {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                    {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                    {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                    {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                    {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                },
                {
                  'element': 'app-todo',
                  'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
                  'directives': [{'name': '_TooltipDirective', 'id': 16}],
                  'children': [{
                    'element': 'div',
                    'component': null,
                    'directives': [{'name': '_TooltipDirective', 'id': 17}],
                    'children': [],
                    'resolutionPath': [
                      {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
                      {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                      {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                      {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                      {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                      {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                      {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                      {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                      {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                      {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                      {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                      {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                      {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                      {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                      {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                      {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                    ]
                  }],
                  'resolutionPath': [
                    {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                    {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                    {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                    {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                    {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                },
                {
                  'element': '#comment',
                  'component': null,
                  'directives': [{'name': '_NgForOf', 'id': 18}],
                  'children': [],
                  'resolutionPath': [
                    {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                    {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                    {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                    {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                }
              ],
              'resolutionPath': [
                {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            }
          ],
          'resolutionPath': [
            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'}
        ]
      },
      {
        'node': {
          'element': 'a',
          'component': null,
          'directives': [{'name': '_RouterLink', 'id': 5}],
          'children': [],
          'resolutionPath': [
            {'id': '8', 'type': 'element', 'name': '_RouterLink'},
            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'}
        ]
      },
      {
        'node': {
          'element': 'a',
          'component': null,
          'directives': [{'name': '_RouterLink', 'id': 6}],
          'children': [],
          'resolutionPath': [
            {'id': '11', 'type': 'element', 'name': '_RouterLink'},
            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'}
        ]
      },
      {
        'node': {
          'element': 'router-outlet',
          'component': null,
          'directives': [{'name': '_RouterOutlet', 'id': 7}],
          'children': [],
          'resolutionPath': [
            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'}
        ]
      },
      {
        'node': {
          'element': 'app-todos',
          'component': {'name': 'app-todos', 'isElement': false, 'id': 8},
          'directives': [],
          'children': [
            {
              'element': 'a',
              'component': null,
              'directives': [{'name': '_RouterLink', 'id': 9}],
              'children': [],
              'resolutionPath': [
                {'id': '13', 'type': 'element', 'name': '_RouterLink'},
                {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            },
            {
              'element': 'a',
              'component': null,
              'directives': [{'name': '_RouterLink', 'id': 10}],
              'children': [],
              'resolutionPath': [
                {'id': '16', 'type': 'element', 'name': '_RouterLink'},
                {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            },
            {
              'element': 'a',
              'component': null,
              'directives': [{'name': '_RouterLink', 'id': 11}],
              'children': [],
              'resolutionPath': [
                {'id': '17', 'type': 'element', 'name': '_RouterLink'},
                {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            },
            {
              'element': 'app-todo',
              'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
              'directives': [{'name': '_TooltipDirective', 'id': 13}],
              'children': [{
                'element': 'div',
                'component': null,
                'directives': [{'name': '_TooltipDirective', 'id': 14}],
                'children': [],
                'resolutionPath': [
                  {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
                  {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                  {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                  {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                  {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                  {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                  {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                  {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                  {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                  {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                  {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                  {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                  {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                  {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                  {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                  {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                ]
              }],
              'resolutionPath': [
                {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            },
            {
              'element': 'app-todo',
              'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
              'directives': [{'name': '_TooltipDirective', 'id': 16}],
              'children': [{
                'element': 'div',
                'component': null,
                'directives': [{'name': '_TooltipDirective', 'id': 17}],
                'children': [],
                'resolutionPath': [
                  {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
                  {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                  {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                  {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                  {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                  {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                  {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                  {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                  {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                  {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                  {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                  {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                  {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                  {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                  {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                  {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                ]
              }],
              'resolutionPath': [
                {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            },
            {
              'element': '#comment',
              'component': null,
              'directives': [{'name': '_NgForOf', 'id': 18}],
              'children': [],
              'resolutionPath': [
                {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            }
          ],
          'resolutionPath': [
            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
          {'id': '14', 'type': 'element', 'name': '_TodosComponent'}
        ]
      },
      {
        'node': {
          'element': 'a',
          'component': null,
          'directives': [{'name': '_RouterLink', 'id': 9}],
          'children': [],
          'resolutionPath': [
            {'id': '13', 'type': 'element', 'name': '_RouterLink'},
            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
          {'id': '14', 'type': 'element', 'name': '_TodosComponent'}
        ]
      },
      {
        'node': {
          'element': 'a',
          'component': null,
          'directives': [{'name': '_RouterLink', 'id': 10}],
          'children': [],
          'resolutionPath': [
            {'id': '16', 'type': 'element', 'name': '_RouterLink'},
            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
          {'id': '14', 'type': 'element', 'name': '_TodosComponent'}
        ]
      },
      {
        'node': {
          'element': 'a',
          'component': null,
          'directives': [{'name': '_RouterLink', 'id': 11}],
          'children': [],
          'resolutionPath': [
            {'id': '17', 'type': 'element', 'name': '_RouterLink'},
            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
          {'id': '14', 'type': 'element', 'name': '_TodosComponent'}
        ]
      },
      {
        'node': {
          'element': 'app-todo',
          'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
          'directives': [{'name': '_TooltipDirective', 'id': 13}],
          'children': [{
            'element': 'div',
            'component': null,
            'directives': [{'name': '_TooltipDirective', 'id': 14}],
            'children': [],
            'resolutionPath': [
              {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
              {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
              {'id': '20', 'type': 'element', 'name': '_NgForOf'},
              {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
              {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
              {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
              {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
              {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
              {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
              {'id': '1', 'type': 'element', 'name': '_AppComponent'},
              {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
              {'id': '10', 'type': 'environment', 'name': '_AppModule'},
              {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
              {'id': '2', 'type': 'environment', 'name': '_AppModule'},
              {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
              {'id': '4', 'type': 'null', 'name': 'Null Injector'}
            ]
          }],
          'resolutionPath': [
            {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
            {'id': '20', 'type': 'element', 'name': '_NgForOf'},
            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
          {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
          {'id': '19', 'type': 'element', 'name': '_TodoComponent'}
        ]
      },
      {
        'node': {
          'element': 'div',
          'component': null,
          'directives': [{'name': '_TooltipDirective', 'id': 14}],
          'children': [],
          'resolutionPath': [
            {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
            {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
            {'id': '20', 'type': 'element', 'name': '_NgForOf'},
            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
          {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
          {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
          {'id': '18', 'type': 'element', 'name': '_TooltipDirective'}
        ]
      },
      {
        'node': {
          'element': 'app-todo',
          'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
          'directives': [{'name': '_TooltipDirective', 'id': 16}],
          'children': [{
            'element': 'div',
            'component': null,
            'directives': [{'name': '_TooltipDirective', 'id': 17}],
            'children': [],
            'resolutionPath': [
              {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
              {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
              {'id': '20', 'type': 'element', 'name': '_NgForOf'},
              {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
              {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
              {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
              {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
              {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
              {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
              {'id': '1', 'type': 'element', 'name': '_AppComponent'},
              {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
              {'id': '10', 'type': 'environment', 'name': '_AppModule'},
              {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
              {'id': '2', 'type': 'environment', 'name': '_AppModule'},
              {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
              {'id': '4', 'type': 'null', 'name': 'Null Injector'}
            ]
          }],
          'resolutionPath': [
            {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
            {'id': '20', 'type': 'element', 'name': '_NgForOf'},
            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
          {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
          {'id': '22', 'type': 'element', 'name': '_TodoComponent'}
        ]
      },
      {
        'node': {
          'element': 'div',
          'component': null,
          'directives': [{'name': '_TooltipDirective', 'id': 17}],
          'children': [],
          'resolutionPath': [
            {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
            {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
            {'id': '20', 'type': 'element', 'name': '_NgForOf'},
            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
          {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
          {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
          {'id': '21', 'type': 'element', 'name': '_TooltipDirective'}
        ]
      },
      {
        'node': {
          'element': '#comment',
          'component': null,
          'directives': [{'name': '_NgForOf', 'id': 18}],
          'children': [],
          'resolutionPath': [
            {'id': '20', 'type': 'element', 'name': '_NgForOf'},
            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
          {'id': '14', 'type': 'element', 'name': '_TodosComponent'}
        ]
      },
      {
        'node': {
          'element': 'app-heavy',
          'component': {'name': 'app-heavy', 'isElement': false, 'id': 20},
          'directives': [],
          'children': [],
          'resolutionPath': [
            {'id': '24', 'type': 'element', 'name': '_HeavyComponent'},
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
          {'id': '24', 'type': 'element', 'name': '_HeavyComponent'}
        ]
      }
    ];

    const expected: InjectorTreeNode = {
      'injector': {'name': '', 'type': 'hidden', 'id': 'N/A'},
      'children': [{
        'injector': {
          'id': '1',
          'type': 'element',
          'name': '_AppComponent',
          'node': {
            'element': 'app-root',
            'component': {'name': 'app-root', 'isElement': false, 'id': 0},
            'directives': [],
            'children': [
              {
                'element': 'router-outlet',
                'component': null,
                'directives': [{'name': '_RouterOutlet', 'id': 1}],
                'children': [],
                'resolutionPath': [
                  {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                  {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                  {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                  {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                  {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                ]
              },
              {
                'element': 'app-demo-component',
                'component': {'name': 'app-demo-component', 'isElement': false, 'id': 2},
                'directives': [],
                'children': [
                  {
                    'element': 'router-outlet',
                    'component': null,
                    'directives': [{'name': '_RouterOutlet', 'id': 3}],
                    'children': [],
                    'resolutionPath': [
                      {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                      {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                      {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                      {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                      {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                      {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                      {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                      {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                    ]
                  },
                  {
                    'element': 'app-todo-demo',
                    'component': {'name': 'app-todo-demo', 'isElement': false, 'id': 4},
                    'directives': [],
                    'children': [
                      {
                        'element': 'a',
                        'component': null,
                        'directives': [{'name': '_RouterLink', 'id': 5}],
                        'children': [],
                        'resolutionPath': [
                          {'id': '8', 'type': 'element', 'name': '_RouterLink'},
                          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                          {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                        ]
                      },
                      {
                        'element': 'a',
                        'component': null,
                        'directives': [{'name': '_RouterLink', 'id': 6}],
                        'children': [],
                        'resolutionPath': [
                          {'id': '11', 'type': 'element', 'name': '_RouterLink'},
                          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                          {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                        ]
                      },
                      {
                        'element': 'router-outlet',
                        'component': null,
                        'directives': [{'name': '_RouterOutlet', 'id': 7}],
                        'children': [],
                        'resolutionPath': [
                          {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                          {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                        ]
                      },
                      {
                        'element': 'app-todos',
                        'component': {'name': 'app-todos', 'isElement': false, 'id': 8},
                        'directives': [],
                        'children': [
                          {
                            'element': 'a',
                            'component': null,
                            'directives': [{'name': '_RouterLink', 'id': 9}],
                            'children': [],
                            'resolutionPath': [
                              {'id': '13', 'type': 'element', 'name': '_RouterLink'},
                              {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                              {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                              {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                              {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                              {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                              {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                              {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                              {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                              {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                              {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                            ]
                          },
                          {
                            'element': 'a',
                            'component': null,
                            'directives': [{'name': '_RouterLink', 'id': 10}],
                            'children': [],
                            'resolutionPath': [
                              {'id': '16', 'type': 'element', 'name': '_RouterLink'},
                              {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                              {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                              {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                              {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                              {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                              {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                              {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                              {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                              {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                              {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                            ]
                          },
                          {
                            'element': 'a',
                            'component': null,
                            'directives': [{'name': '_RouterLink', 'id': 11}],
                            'children': [],
                            'resolutionPath': [
                              {'id': '17', 'type': 'element', 'name': '_RouterLink'},
                              {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                              {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                              {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                              {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                              {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                              {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                              {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                              {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                              {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                              {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                            ]
                          },
                          {
                            'element': 'app-todo',
                            'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
                            'directives': [{'name': '_TooltipDirective', 'id': 13}],
                            'children': [{
                              'element': 'div',
                              'component': null,
                              'directives': [{'name': '_TooltipDirective', 'id': 14}],
                              'children': [],
                              'resolutionPath': [
                                {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
                                {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                                {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                                {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                                {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                                {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                                {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                                {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                                {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                              ]
                            }],
                            'resolutionPath': [
                              {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                              {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                              {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                              {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                              {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                              {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                              {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                              {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                              {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                              {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                              {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                              {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                            ]
                          },
                          {
                            'element': 'app-todo',
                            'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
                            'directives': [{'name': '_TooltipDirective', 'id': 16}],
                            'children': [{
                              'element': 'div',
                              'component': null,
                              'directives': [{'name': '_TooltipDirective', 'id': 17}],
                              'children': [],
                              'resolutionPath': [
                                {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
                                {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                                {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                                {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                                {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                                {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                                {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                                {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                                {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                              ]
                            }],
                            'resolutionPath': [
                              {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                              {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                              {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                              {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                              {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                              {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                              {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                              {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                              {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                              {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                              {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                              {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                            ]
                          },
                          {
                            'element': '#comment',
                            'component': null,
                            'directives': [{'name': '_NgForOf', 'id': 18}],
                            'children': [],
                            'resolutionPath': [
                              {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                              {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                              {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                              {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                              {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                              {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                              {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                              {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                              {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                              {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                              {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                            ]
                          }
                        ],
                        'resolutionPath': [
                          {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                          {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                          {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                          {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                        ]
                      }
                    ],
                    'resolutionPath': [
                      {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                      {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                      {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                      {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                      {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                      {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                      {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                      {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                      {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                      {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                    ]
                  },
                  {
                    'element': 'app-heavy',
                    'component': {'name': 'app-heavy', 'isElement': false, 'id': 20},
                    'directives': [],
                    'children': [],
                    'resolutionPath': [
                      {'id': '24', 'type': 'element', 'name': '_HeavyComponent'},
                      {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                      {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                      {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                      {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                      {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                      {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                      {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                    ]
                  }
                ],
                'resolutionPath': [
                  {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                  {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                  {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                  {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                  {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                  {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                  {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                ]
              }
            ],
            'resolutionPath': [
              {'id': '1', 'type': 'element', 'name': '_AppComponent'},
              {'id': '2', 'type': 'environment', 'name': '_AppModule'},
              {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
              {'id': '4', 'type': 'null', 'name': 'Null Injector'}
            ]
          }
        },
        'children': [{
          'injector': {
            'id': '6',
            'type': 'element',
            'name': '_DemoAppComponent',
            'node': {
              'element': 'app-demo-component',
              'component': {'name': 'app-demo-component', 'isElement': false, 'id': 2},
              'directives': [],
              'children': [
                {
                  'element': 'router-outlet',
                  'component': null,
                  'directives': [{'name': '_RouterOutlet', 'id': 3}],
                  'children': [],
                  'resolutionPath': [
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                },
                {
                  'element': 'app-todo-demo',
                  'component': {'name': 'app-todo-demo', 'isElement': false, 'id': 4},
                  'directives': [],
                  'children': [
                    {
                      'element': 'a',
                      'component': null,
                      'directives': [{'name': '_RouterLink', 'id': 5}],
                      'children': [],
                      'resolutionPath': [
                        {'id': '8', 'type': 'element', 'name': '_RouterLink'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    },
                    {
                      'element': 'a',
                      'component': null,
                      'directives': [{'name': '_RouterLink', 'id': 6}],
                      'children': [],
                      'resolutionPath': [
                        {'id': '11', 'type': 'element', 'name': '_RouterLink'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    },
                    {
                      'element': 'router-outlet',
                      'component': null,
                      'directives': [{'name': '_RouterOutlet', 'id': 7}],
                      'children': [],
                      'resolutionPath': [
                        {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    },
                    {
                      'element': 'app-todos',
                      'component': {'name': 'app-todos', 'isElement': false, 'id': 8},
                      'directives': [],
                      'children': [
                        {
                          'element': 'a',
                          'component': null,
                          'directives': [{'name': '_RouterLink', 'id': 9}],
                          'children': [],
                          'resolutionPath': [
                            {'id': '13', 'type': 'element', 'name': '_RouterLink'},
                            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                          ]
                        },
                        {
                          'element': 'a',
                          'component': null,
                          'directives': [{'name': '_RouterLink', 'id': 10}],
                          'children': [],
                          'resolutionPath': [
                            {'id': '16', 'type': 'element', 'name': '_RouterLink'},
                            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                          ]
                        },
                        {
                          'element': 'a',
                          'component': null,
                          'directives': [{'name': '_RouterLink', 'id': 11}],
                          'children': [],
                          'resolutionPath': [
                            {'id': '17', 'type': 'element', 'name': '_RouterLink'},
                            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                          ]
                        },
                        {
                          'element': 'app-todo',
                          'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
                          'directives': [{'name': '_TooltipDirective', 'id': 13}],
                          'children': [{
                            'element': 'div',
                            'component': null,
                            'directives': [{'name': '_TooltipDirective', 'id': 14}],
                            'children': [],
                            'resolutionPath': [
                              {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
                              {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                              {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                              {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                              {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                              {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                              {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                              {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                              {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                              {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                              {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                              {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                              {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                            ]
                          }],
                          'resolutionPath': [
                            {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                            {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                          ]
                        },
                        {
                          'element': 'app-todo',
                          'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
                          'directives': [{'name': '_TooltipDirective', 'id': 16}],
                          'children': [{
                            'element': 'div',
                            'component': null,
                            'directives': [{'name': '_TooltipDirective', 'id': 17}],
                            'children': [],
                            'resolutionPath': [
                              {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
                              {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                              {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                              {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                              {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                              {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                              {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                              {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                              {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                              {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                              {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                              {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                              {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                            ]
                          }],
                          'resolutionPath': [
                            {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                            {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                          ]
                        },
                        {
                          'element': '#comment',
                          'component': null,
                          'directives': [{'name': '_NgForOf', 'id': 18}],
                          'children': [],
                          'resolutionPath': [
                            {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                          ]
                        }
                      ],
                      'resolutionPath': [
                        {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                        {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    }
                  ],
                  'resolutionPath': [
                    {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                },
                {
                  'element': 'app-heavy',
                  'component': {'name': 'app-heavy', 'isElement': false, 'id': 20},
                  'directives': [],
                  'children': [],
                  'resolutionPath': [
                    {'id': '24', 'type': 'element', 'name': '_HeavyComponent'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                }
              ],
              'resolutionPath': [
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            }
          },
          'children': [
            {
              'injector': {
                'id': '9',
                'type': 'element',
                'name': '_AppTodoComponent',
                'node': {
                  'element': 'app-todo-demo',
                  'component': {'name': 'app-todo-demo', 'isElement': false, 'id': 4},
                  'directives': [],
                  'children': [
                    {
                      'element': 'a',
                      'component': null,
                      'directives': [{'name': '_RouterLink', 'id': 5}],
                      'children': [],
                      'resolutionPath': [
                        {'id': '8', 'type': 'element', 'name': '_RouterLink'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    },
                    {
                      'element': 'a',
                      'component': null,
                      'directives': [{'name': '_RouterLink', 'id': 6}],
                      'children': [],
                      'resolutionPath': [
                        {'id': '11', 'type': 'element', 'name': '_RouterLink'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    },
                    {
                      'element': 'router-outlet',
                      'component': null,
                      'directives': [{'name': '_RouterOutlet', 'id': 7}],
                      'children': [],
                      'resolutionPath': [
                        {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    },
                    {
                      'element': 'app-todos',
                      'component': {'name': 'app-todos', 'isElement': false, 'id': 8},
                      'directives': [],
                      'children': [
                        {
                          'element': 'a',
                          'component': null,
                          'directives': [{'name': '_RouterLink', 'id': 9}],
                          'children': [],
                          'resolutionPath': [
                            {'id': '13', 'type': 'element', 'name': '_RouterLink'},
                            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                          ]
                        },
                        {
                          'element': 'a',
                          'component': null,
                          'directives': [{'name': '_RouterLink', 'id': 10}],
                          'children': [],
                          'resolutionPath': [
                            {'id': '16', 'type': 'element', 'name': '_RouterLink'},
                            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                          ]
                        },
                        {
                          'element': 'a',
                          'component': null,
                          'directives': [{'name': '_RouterLink', 'id': 11}],
                          'children': [],
                          'resolutionPath': [
                            {'id': '17', 'type': 'element', 'name': '_RouterLink'},
                            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                          ]
                        },
                        {
                          'element': 'app-todo',
                          'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
                          'directives': [{'name': '_TooltipDirective', 'id': 13}],
                          'children': [{
                            'element': 'div',
                            'component': null,
                            'directives': [{'name': '_TooltipDirective', 'id': 14}],
                            'children': [],
                            'resolutionPath': [
                              {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
                              {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                              {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                              {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                              {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                              {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                              {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                              {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                              {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                              {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                              {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                              {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                              {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                            ]
                          }],
                          'resolutionPath': [
                            {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                            {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                          ]
                        },
                        {
                          'element': 'app-todo',
                          'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
                          'directives': [{'name': '_TooltipDirective', 'id': 16}],
                          'children': [{
                            'element': 'div',
                            'component': null,
                            'directives': [{'name': '_TooltipDirective', 'id': 17}],
                            'children': [],
                            'resolutionPath': [
                              {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
                              {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                              {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                              {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                              {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                              {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                              {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                              {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                              {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                              {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                              {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                              {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                              {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                            ]
                          }],
                          'resolutionPath': [
                            {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                            {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                          ]
                        },
                        {
                          'element': '#comment',
                          'component': null,
                          'directives': [{'name': '_NgForOf', 'id': 18}],
                          'children': [],
                          'resolutionPath': [
                            {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                          ]
                        }
                      ],
                      'resolutionPath': [
                        {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                        {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    }
                  ],
                  'resolutionPath': [
                    {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                }
              },
              'children': [{
                'injector': {
                  'id': '14',
                  'type': 'element',
                  'name': '_TodosComponent',
                  'node': {
                    'element': 'app-todos',
                    'component': {'name': 'app-todos', 'isElement': false, 'id': 8},
                    'directives': [],
                    'children': [
                      {
                        'element': 'a',
                        'component': null,
                        'directives': [{'name': '_RouterLink', 'id': 9}],
                        'children': [],
                        'resolutionPath': [
                          {'id': '13', 'type': 'element', 'name': '_RouterLink'},
                          {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                          {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                          {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                          {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                        ]
                      },
                      {
                        'element': 'a',
                        'component': null,
                        'directives': [{'name': '_RouterLink', 'id': 10}],
                        'children': [],
                        'resolutionPath': [
                          {'id': '16', 'type': 'element', 'name': '_RouterLink'},
                          {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                          {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                          {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                          {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                        ]
                      },
                      {
                        'element': 'a',
                        'component': null,
                        'directives': [{'name': '_RouterLink', 'id': 11}],
                        'children': [],
                        'resolutionPath': [
                          {'id': '17', 'type': 'element', 'name': '_RouterLink'},
                          {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                          {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                          {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                          {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                        ]
                      },
                      {
                        'element': 'app-todo',
                        'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
                        'directives': [{'name': '_TooltipDirective', 'id': 13}],
                        'children': [{
                          'element': 'div',
                          'component': null,
                          'directives': [{'name': '_TooltipDirective', 'id': 14}],
                          'children': [],
                          'resolutionPath': [
                            {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
                            {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                            {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                          ]
                        }],
                        'resolutionPath': [
                          {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                          {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                          {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                          {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                          {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                          {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                        ]
                      },
                      {
                        'element': 'app-todo',
                        'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
                        'directives': [{'name': '_TooltipDirective', 'id': 16}],
                        'children': [{
                          'element': 'div',
                          'component': null,
                          'directives': [{'name': '_TooltipDirective', 'id': 17}],
                          'children': [],
                          'resolutionPath': [
                            {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
                            {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                            {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                          ]
                        }],
                        'resolutionPath': [
                          {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                          {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                          {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                          {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                          {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                          {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                        ]
                      },
                      {
                        'element': '#comment',
                        'component': null,
                        'directives': [{'name': '_NgForOf', 'id': 18}],
                        'children': [],
                        'resolutionPath': [
                          {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                          {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                          {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                          {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                          {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                        ]
                      }
                    ],
                    'resolutionPath': [
                      {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                      {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                      {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                      {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                      {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                      {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                      {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                      {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                      {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                      {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                      {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                      {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                      {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                    ]
                  }
                },
                'children': [
                  {
                    'injector': {
                      'id': '19',
                      'type': 'element',
                      'name': '_TodoComponent',
                      'node': {
                        'element': 'app-todo',
                        'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
                        'directives': [{'name': '_TooltipDirective', 'id': 13}],
                        'children': [{
                          'element': 'div',
                          'component': null,
                          'directives': [{'name': '_TooltipDirective', 'id': 14}],
                          'children': [],
                          'resolutionPath': [
                            {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
                            {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                            {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                          ]
                        }],
                        'resolutionPath': [
                          {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                          {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                          {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                          {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                          {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                          {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                        ]
                      }
                    },
                    'children': [{
                      'injector': {
                        'id': '18',
                        'type': 'element',
                        'name': '_TooltipDirective',
                        'node': {
                          'element': 'div',
                          'component': null,
                          'directives': [{'name': '_TooltipDirective', 'id': 14}],
                          'children': [],
                          'resolutionPath': [
                            {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
                            {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                            {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                          ]
                        }
                      },
                      'children': []
                    }]
                  },
                  {
                    'injector': {
                      'id': '22',
                      'type': 'element',
                      'name': '_TodoComponent',
                      'node': {
                        'element': 'app-todo',
                        'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
                        'directives': [{'name': '_TooltipDirective', 'id': 16}],
                        'children': [{
                          'element': 'div',
                          'component': null,
                          'directives': [{'name': '_TooltipDirective', 'id': 17}],
                          'children': [],
                          'resolutionPath': [
                            {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
                            {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                            {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                          ]
                        }],
                        'resolutionPath': [
                          {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                          {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                          {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                          {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                          {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                          {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                        ]
                      }
                    },
                    'children': [{
                      'injector': {
                        'id': '21',
                        'type': 'element',
                        'name': '_TooltipDirective',
                        'node': {
                          'element': 'div',
                          'component': null,
                          'directives': [{'name': '_TooltipDirective', 'id': 17}],
                          'children': [],
                          'resolutionPath': [
                            {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
                            {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                            {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                          ]
                        }
                      },
                      'children': []
                    }]
                  }
                ]
              }]
            },
            {
              'injector': {
                'id': '24',
                'type': 'element',
                'name': '_HeavyComponent',
                'node': {
                  'element': 'app-heavy',
                  'component': {'name': 'app-heavy', 'isElement': false, 'id': 20},
                  'directives': [],
                  'children': [],
                  'resolutionPath': [
                    {'id': '24', 'type': 'element', 'name': '_HeavyComponent'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                }
              },
              'children': []
            }
          ]
        }]
      }]
    };

    expect(transformInjectorResolutionPathsIntoTree(injectorPaths)).toEqual(expected);
  });
});

describe('splitInjectorPathsIntoElementAndEnvironmentPaths', () => {
  it('should be able to split injector paths into element and environment paths, and expose the mapping from each element to it\'s environment path',
     () => {
       const injectorPaths = [
         {
           'node': {
             'element': 'app-root',
             'component': {'name': 'app-root', 'isElement': false, 'id': 0},
             'directives': [],
             'children': [
               {
                 'element': 'router-outlet',
                 'component': null,
                 'directives': [{'name': '_RouterOutlet', 'id': 1}],
                 'children': [],
                 'resolutionPath': [
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'app-demo-component',
                 'component': {'name': 'app-demo-component', 'isElement': false, 'id': 2},
                 'directives': [],
                 'children': [
                   {
                     'element': 'router-outlet',
                     'component': null,
                     'directives': [{'name': '_RouterOutlet', 'id': 3}],
                     'children': [],
                     'resolutionPath': [
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': 'app-todo-demo',
                     'component': {'name': 'app-todo-demo', 'isElement': false, 'id': 4},
                     'directives': [],
                     'children': [
                       {
                         'element': 'a',
                         'component': null,
                         'directives': [{'name': '_RouterLink', 'id': 5}],
                         'children': [],
                         'resolutionPath': [
                           {'id': '8', 'type': 'element', 'name': '_RouterLink'},
                           {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                           {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                           {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                           {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                           {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                           {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                         ]
                       },
                       {
                         'element': 'a',
                         'component': null,
                         'directives': [{'name': '_RouterLink', 'id': 6}],
                         'children': [],
                         'resolutionPath': [
                           {'id': '11', 'type': 'element', 'name': '_RouterLink'},
                           {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                           {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                           {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                           {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                           {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                           {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                         ]
                       },
                       {
                         'element': 'router-outlet',
                         'component': null,
                         'directives': [{'name': '_RouterOutlet', 'id': 7}],
                         'children': [],
                         'resolutionPath': [
                           {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                           {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                           {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                           {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                           {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                           {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                         ]
                       },
                       {
                         'element': 'app-todos',
                         'component': {'name': 'app-todos', 'isElement': false, 'id': 8},
                         'directives': [],
                         'children': [
                           {
                             'element': 'a',
                             'component': null,
                             'directives': [{'name': '_RouterLink', 'id': 9}],
                             'children': [],
                             'resolutionPath': [
                               {'id': '13', 'type': 'element', 'name': '_RouterLink'},
                               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                             ]
                           },
                           {
                             'element': 'a',
                             'component': null,
                             'directives': [{'name': '_RouterLink', 'id': 10}],
                             'children': [],
                             'resolutionPath': [
                               {'id': '16', 'type': 'element', 'name': '_RouterLink'},
                               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                             ]
                           },
                           {
                             'element': 'a',
                             'component': null,
                             'directives': [{'name': '_RouterLink', 'id': 11}],
                             'children': [],
                             'resolutionPath': [
                               {'id': '17', 'type': 'element', 'name': '_RouterLink'},
                               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                             ]
                           },
                           {
                             'element': 'app-todo',
                             'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
                             'directives': [{'name': '_TooltipDirective', 'id': 13}],
                             'children': [{
                               'element': 'div',
                               'component': null,
                               'directives': [{'name': '_TooltipDirective', 'id': 14}],
                               'children': [],
                               'resolutionPath': [
                                 {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
                                 {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                                 {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                                 {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                                 {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                                 {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                                 {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                                 {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                                 {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                                 {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                                 {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                                 {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                                 {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                                 {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                                 {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                                 {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                               ]
                             }],
                             'resolutionPath': [
                               {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                               {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                             ]
                           },
                           {
                             'element': 'app-todo',
                             'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
                             'directives': [{'name': '_TooltipDirective', 'id': 16}],
                             'children': [{
                               'element': 'div',
                               'component': null,
                               'directives': [{'name': '_TooltipDirective', 'id': 17}],
                               'children': [],
                               'resolutionPath': [
                                 {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
                                 {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                                 {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                                 {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                                 {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                                 {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                                 {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                                 {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                                 {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                                 {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                                 {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                                 {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                                 {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                                 {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                                 {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                                 {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                               ]
                             }],
                             'resolutionPath': [
                               {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                               {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                             ]
                           },
                           {
                             'element': '#comment',
                             'component': null,
                             'directives': [{'name': '_NgForOf', 'id': 18}],
                             'children': [],
                             'resolutionPath': [
                               {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                             ]
                           }
                         ],
                         'resolutionPath': [
                           {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                           {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                           {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                           {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                           {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                           {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                           {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                           {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                         ]
                       }
                     ],
                     'resolutionPath': [
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': 'app-zippy',
                     'component': {'name': 'app-zippy', 'isElement': true, 'id': 19},
                     'directives': [],
                     'children': [],
                     'resolutionPath': [
                       {'id': '23', 'type': 'element', 'name': '_ZippyComponent'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': 'app-heavy',
                     'component': {'name': 'app-heavy', 'isElement': false, 'id': 20},
                     'directives': [],
                     'children': [],
                     'resolutionPath': [
                       {'id': '24', 'type': 'element', 'name': '_HeavyComponent'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   }
                 ],
                 'resolutionPath': [
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               }
             ],
             'resolutionPath': [
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '1', 'type': 'element', 'name': '_AppComponent'}
           ]
         },
         {
           'node': {
             'element': 'router-outlet',
             'component': null,
             'directives': [{'name': '_RouterOutlet', 'id': 1}],
             'children': [],
             'resolutionPath': [
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '1', 'type': 'element', 'name': '_AppComponent'}
           ]
         },
         {
           'node': {
             'element': 'app-demo-component',
             'component': {'name': 'app-demo-component', 'isElement': false, 'id': 2},
             'directives': [],
             'children': [
               {
                 'element': 'router-outlet',
                 'component': null,
                 'directives': [{'name': '_RouterOutlet', 'id': 3}],
                 'children': [],
                 'resolutionPath': [
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'app-todo-demo',
                 'component': {'name': 'app-todo-demo', 'isElement': false, 'id': 4},
                 'directives': [],
                 'children': [
                   {
                     'element': 'a',
                     'component': null,
                     'directives': [{'name': '_RouterLink', 'id': 5}],
                     'children': [],
                     'resolutionPath': [
                       {'id': '8', 'type': 'element', 'name': '_RouterLink'},
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': 'a',
                     'component': null,
                     'directives': [{'name': '_RouterLink', 'id': 6}],
                     'children': [],
                     'resolutionPath': [
                       {'id': '11', 'type': 'element', 'name': '_RouterLink'},
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': 'router-outlet',
                     'component': null,
                     'directives': [{'name': '_RouterOutlet', 'id': 7}],
                     'children': [],
                     'resolutionPath': [
                       {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': 'app-todos',
                     'component': {'name': 'app-todos', 'isElement': false, 'id': 8},
                     'directives': [],
                     'children': [
                       {
                         'element': 'a',
                         'component': null,
                         'directives': [{'name': '_RouterLink', 'id': 9}],
                         'children': [],
                         'resolutionPath': [
                           {'id': '13', 'type': 'element', 'name': '_RouterLink'},
                           {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                           {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                           {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                           {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                           {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                           {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                           {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                           {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                         ]
                       },
                       {
                         'element': 'a',
                         'component': null,
                         'directives': [{'name': '_RouterLink', 'id': 10}],
                         'children': [],
                         'resolutionPath': [
                           {'id': '16', 'type': 'element', 'name': '_RouterLink'},
                           {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                           {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                           {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                           {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                           {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                           {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                           {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                           {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                         ]
                       },
                       {
                         'element': 'a',
                         'component': null,
                         'directives': [{'name': '_RouterLink', 'id': 11}],
                         'children': [],
                         'resolutionPath': [
                           {'id': '17', 'type': 'element', 'name': '_RouterLink'},
                           {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                           {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                           {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                           {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                           {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                           {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                           {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                           {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                         ]
                       },
                       {
                         'element': 'app-todo',
                         'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
                         'directives': [{'name': '_TooltipDirective', 'id': 13}],
                         'children': [{
                           'element': 'div',
                           'component': null,
                           'directives': [{'name': '_TooltipDirective', 'id': 14}],
                           'children': [],
                           'resolutionPath': [
                             {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
                             {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                             {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                             {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                             {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                             {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                             {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                             {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                             {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                             {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                           ]
                         }],
                         'resolutionPath': [
                           {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                           {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                           {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                           {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                           {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                           {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                           {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                           {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                           {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                           {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                         ]
                       },
                       {
                         'element': 'app-todo',
                         'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
                         'directives': [{'name': '_TooltipDirective', 'id': 16}],
                         'children': [{
                           'element': 'div',
                           'component': null,
                           'directives': [{'name': '_TooltipDirective', 'id': 17}],
                           'children': [],
                           'resolutionPath': [
                             {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
                             {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                             {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                             {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                             {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                             {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                             {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                             {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                             {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                             {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                           ]
                         }],
                         'resolutionPath': [
                           {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                           {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                           {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                           {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                           {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                           {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                           {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                           {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                           {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                           {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                         ]
                       },
                       {
                         'element': '#comment',
                         'component': null,
                         'directives': [{'name': '_NgForOf', 'id': 18}],
                         'children': [],
                         'resolutionPath': [
                           {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                           {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                           {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                           {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                           {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                           {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                           {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                           {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                           {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                         ]
                       }
                     ],
                     'resolutionPath': [
                       {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                       {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   }
                 ],
                 'resolutionPath': [
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'app-zippy',
                 'component': {'name': 'app-zippy', 'isElement': true, 'id': 19},
                 'directives': [],
                 'children': [],
                 'resolutionPath': [
                   {'id': '23', 'type': 'element', 'name': '_ZippyComponent'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'app-heavy',
                 'component': {'name': 'app-heavy', 'isElement': false, 'id': 20},
                 'directives': [],
                 'children': [],
                 'resolutionPath': [
                   {'id': '24', 'type': 'element', 'name': '_HeavyComponent'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               }
             ],
             'resolutionPath': [
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'}
           ]
         },
         {
           'node': {
             'element': 'router-outlet',
             'component': null,
             'directives': [{'name': '_RouterOutlet', 'id': 3}],
             'children': [],
             'resolutionPath': [
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'}
           ]
         },
         {
           'node': {
             'element': 'app-todo-demo',
             'component': {'name': 'app-todo-demo', 'isElement': false, 'id': 4},
             'directives': [],
             'children': [
               {
                 'element': 'a',
                 'component': null,
                 'directives': [{'name': '_RouterLink', 'id': 5}],
                 'children': [],
                 'resolutionPath': [
                   {'id': '8', 'type': 'element', 'name': '_RouterLink'},
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'a',
                 'component': null,
                 'directives': [{'name': '_RouterLink', 'id': 6}],
                 'children': [],
                 'resolutionPath': [
                   {'id': '11', 'type': 'element', 'name': '_RouterLink'},
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'router-outlet',
                 'component': null,
                 'directives': [{'name': '_RouterOutlet', 'id': 7}],
                 'children': [],
                 'resolutionPath': [
                   {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'app-todos',
                 'component': {'name': 'app-todos', 'isElement': false, 'id': 8},
                 'directives': [],
                 'children': [
                   {
                     'element': 'a',
                     'component': null,
                     'directives': [{'name': '_RouterLink', 'id': 9}],
                     'children': [],
                     'resolutionPath': [
                       {'id': '13', 'type': 'element', 'name': '_RouterLink'},
                       {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                       {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': 'a',
                     'component': null,
                     'directives': [{'name': '_RouterLink', 'id': 10}],
                     'children': [],
                     'resolutionPath': [
                       {'id': '16', 'type': 'element', 'name': '_RouterLink'},
                       {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                       {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': 'a',
                     'component': null,
                     'directives': [{'name': '_RouterLink', 'id': 11}],
                     'children': [],
                     'resolutionPath': [
                       {'id': '17', 'type': 'element', 'name': '_RouterLink'},
                       {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                       {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': 'app-todo',
                     'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
                     'directives': [{'name': '_TooltipDirective', 'id': 13}],
                     'children': [{
                       'element': 'div',
                       'component': null,
                       'directives': [{'name': '_TooltipDirective', 'id': 14}],
                       'children': [],
                       'resolutionPath': [
                         {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
                         {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                         {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                         {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                         {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                         {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                         {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                         {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                         {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                         {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                         {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                         {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                         {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                         {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                         {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                         {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                       ]
                     }],
                     'resolutionPath': [
                       {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                       {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                       {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                       {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': 'app-todo',
                     'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
                     'directives': [{'name': '_TooltipDirective', 'id': 16}],
                     'children': [{
                       'element': 'div',
                       'component': null,
                       'directives': [{'name': '_TooltipDirective', 'id': 17}],
                       'children': [],
                       'resolutionPath': [
                         {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
                         {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                         {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                         {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                         {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                         {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                         {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                         {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                         {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                         {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                         {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                         {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                         {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                         {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                         {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                         {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                       ]
                     }],
                     'resolutionPath': [
                       {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                       {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                       {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                       {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': '#comment',
                     'component': null,
                     'directives': [{'name': '_NgForOf', 'id': 18}],
                     'children': [],
                     'resolutionPath': [
                       {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                       {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                       {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   }
                 ],
                 'resolutionPath': [
                   {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                   {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               }
             ],
             'resolutionPath': [
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'}
           ]
         },
         {
           'node': {
             'element': 'a',
             'component': null,
             'directives': [{'name': '_RouterLink', 'id': 5}],
             'children': [],
             'resolutionPath': [
               {'id': '8', 'type': 'element', 'name': '_RouterLink'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'}
           ]
         },
         {
           'node': {
             'element': 'a',
             'component': null,
             'directives': [{'name': '_RouterLink', 'id': 6}],
             'children': [],
             'resolutionPath': [
               {'id': '11', 'type': 'element', 'name': '_RouterLink'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'}
           ]
         },
         {
           'node': {
             'element': 'router-outlet',
             'component': null,
             'directives': [{'name': '_RouterOutlet', 'id': 7}],
             'children': [],
             'resolutionPath': [
               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'}
           ]
         },
         {
           'node': {
             'element': 'app-todos',
             'component': {'name': 'app-todos', 'isElement': false, 'id': 8},
             'directives': [],
             'children': [
               {
                 'element': 'a',
                 'component': null,
                 'directives': [{'name': '_RouterLink', 'id': 9}],
                 'children': [],
                 'resolutionPath': [
                   {'id': '13', 'type': 'element', 'name': '_RouterLink'},
                   {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                   {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'a',
                 'component': null,
                 'directives': [{'name': '_RouterLink', 'id': 10}],
                 'children': [],
                 'resolutionPath': [
                   {'id': '16', 'type': 'element', 'name': '_RouterLink'},
                   {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                   {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'a',
                 'component': null,
                 'directives': [{'name': '_RouterLink', 'id': 11}],
                 'children': [],
                 'resolutionPath': [
                   {'id': '17', 'type': 'element', 'name': '_RouterLink'},
                   {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                   {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'app-todo',
                 'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
                 'directives': [{'name': '_TooltipDirective', 'id': 13}],
                 'children': [{
                   'element': 'div',
                   'component': null,
                   'directives': [{'name': '_TooltipDirective', 'id': 14}],
                   'children': [],
                   'resolutionPath': [
                     {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
                     {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                     {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                     {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                     {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                     {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                     {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                     {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                     {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                     {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                     {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                     {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                     {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                     {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                     {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                     {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                   ]
                 }],
                 'resolutionPath': [
                   {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                   {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                   {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                   {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'app-todo',
                 'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
                 'directives': [{'name': '_TooltipDirective', 'id': 16}],
                 'children': [{
                   'element': 'div',
                   'component': null,
                   'directives': [{'name': '_TooltipDirective', 'id': 17}],
                   'children': [],
                   'resolutionPath': [
                     {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
                     {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                     {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                     {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                     {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                     {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                     {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                     {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                     {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                     {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                     {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                     {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                     {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                     {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                     {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                     {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                   ]
                 }],
                 'resolutionPath': [
                   {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                   {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                   {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                   {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': '#comment',
                 'component': null,
                 'directives': [{'name': '_NgForOf', 'id': 18}],
                 'children': [],
                 'resolutionPath': [
                   {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                   {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                   {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               }
             ],
             'resolutionPath': [
               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
             {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
             {'id': '14', 'type': 'element', 'name': '_TodosComponent'}
           ]
         },
         {
           'node': {
             'element': 'a',
             'component': null,
             'directives': [{'name': '_RouterLink', 'id': 9}],
             'children': [],
             'resolutionPath': [
               {'id': '13', 'type': 'element', 'name': '_RouterLink'},
               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
             {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
             {'id': '14', 'type': 'element', 'name': '_TodosComponent'}
           ]
         },
         {
           'node': {
             'element': 'a',
             'component': null,
             'directives': [{'name': '_RouterLink', 'id': 10}],
             'children': [],
             'resolutionPath': [
               {'id': '16', 'type': 'element', 'name': '_RouterLink'},
               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
             {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
             {'id': '14', 'type': 'element', 'name': '_TodosComponent'}
           ]
         },
         {
           'node': {
             'element': 'a',
             'component': null,
             'directives': [{'name': '_RouterLink', 'id': 11}],
             'children': [],
             'resolutionPath': [
               {'id': '17', 'type': 'element', 'name': '_RouterLink'},
               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
             {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
             {'id': '14', 'type': 'element', 'name': '_TodosComponent'}
           ]
         },
         {
           'node': {
             'element': 'app-todo',
             'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
             'directives': [{'name': '_TooltipDirective', 'id': 13}],
             'children': [{
               'element': 'div',
               'component': null,
               'directives': [{'name': '_TooltipDirective', 'id': 14}],
               'children': [],
               'resolutionPath': [
                 {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
                 {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                 {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                 {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                 {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                 {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                 {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                 {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                 {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                 {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                 {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                 {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                 {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                 {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                 {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                 {'id': '4', 'type': 'null', 'name': 'Null Injector'}
               ]
             }],
             'resolutionPath': [
               {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
               {'id': '20', 'type': 'element', 'name': '_NgForOf'},
               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
             {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
             {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
             {'id': '19', 'type': 'element', 'name': '_TodoComponent'}
           ]
         },
         {
           'node': {
             'element': 'div',
             'component': null,
             'directives': [{'name': '_TooltipDirective', 'id': 14}],
             'children': [],
             'resolutionPath': [
               {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
               {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
               {'id': '20', 'type': 'element', 'name': '_NgForOf'},
               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
             {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
             {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
             {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
             {'id': '18', 'type': 'element', 'name': '_TooltipDirective'}
           ]
         },
         {
           'node': {
             'element': 'app-todo',
             'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
             'directives': [{'name': '_TooltipDirective', 'id': 16}],
             'children': [{
               'element': 'div',
               'component': null,
               'directives': [{'name': '_TooltipDirective', 'id': 17}],
               'children': [],
               'resolutionPath': [
                 {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
                 {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                 {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                 {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                 {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                 {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                 {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                 {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                 {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                 {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                 {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                 {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                 {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                 {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                 {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                 {'id': '4', 'type': 'null', 'name': 'Null Injector'}
               ]
             }],
             'resolutionPath': [
               {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
               {'id': '20', 'type': 'element', 'name': '_NgForOf'},
               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
             {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
             {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
             {'id': '22', 'type': 'element', 'name': '_TodoComponent'}
           ]
         },
         {
           'node': {
             'element': 'div',
             'component': null,
             'directives': [{'name': '_TooltipDirective', 'id': 17}],
             'children': [],
             'resolutionPath': [
               {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
               {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
               {'id': '20', 'type': 'element', 'name': '_NgForOf'},
               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
             {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
             {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
             {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
             {'id': '21', 'type': 'element', 'name': '_TooltipDirective'}
           ]
         },
         {
           'node': {
             'element': '#comment',
             'component': null,
             'directives': [{'name': '_NgForOf', 'id': 18}],
             'children': [],
             'resolutionPath': [
               {'id': '20', 'type': 'element', 'name': '_NgForOf'},
               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
             {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
             {'id': '14', 'type': 'element', 'name': '_TodosComponent'}
           ]
         },
         {
           'node': {
             'element': 'app-zippy',
             'component': {'name': 'app-zippy', 'isElement': true, 'id': 19},
             'directives': [],
             'children': [],
             'resolutionPath': [
               {'id': '23', 'type': 'element', 'name': '_ZippyComponent'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '23', 'type': 'element', 'name': '_ZippyComponent'}
           ]
         },
         {
           'node': {
             'element': 'app-heavy',
             'component': {'name': 'app-heavy', 'isElement': false, 'id': 20},
             'directives': [],
             'children': [],
             'resolutionPath': [
               {'id': '24', 'type': 'element', 'name': '_HeavyComponent'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
             {'id': '24', 'type': 'element', 'name': '_HeavyComponent'}
           ]
         }
       ];

       const expectedElementPaths = [
         {
           'node': {
             'element': 'app-root',
             'component': {'name': 'app-root', 'isElement': false, 'id': 0},
             'directives': [],
             'children': [
               {
                 'element': 'router-outlet',
                 'component': null,
                 'directives': [{'name': '_RouterOutlet', 'id': 1}],
                 'children': [],
                 'resolutionPath': [
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'app-demo-component',
                 'component': {'name': 'app-demo-component', 'isElement': false, 'id': 2},
                 'directives': [],
                 'children': [
                   {
                     'element': 'router-outlet',
                     'component': null,
                     'directives': [{'name': '_RouterOutlet', 'id': 3}],
                     'children': [],
                     'resolutionPath': [
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': 'app-todo-demo',
                     'component': {'name': 'app-todo-demo', 'isElement': false, 'id': 4},
                     'directives': [],
                     'children': [
                       {
                         'element': 'a',
                         'component': null,
                         'directives': [{'name': '_RouterLink', 'id': 5}],
                         'children': [],
                         'resolutionPath': [
                           {'id': '8', 'type': 'element', 'name': '_RouterLink'},
                           {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                           {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                           {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                           {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                           {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                           {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                         ]
                       },
                       {
                         'element': 'a',
                         'component': null,
                         'directives': [{'name': '_RouterLink', 'id': 6}],
                         'children': [],
                         'resolutionPath': [
                           {'id': '11', 'type': 'element', 'name': '_RouterLink'},
                           {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                           {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                           {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                           {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                           {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                           {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                         ]
                       },
                       {
                         'element': 'router-outlet',
                         'component': null,
                         'directives': [{'name': '_RouterOutlet', 'id': 7}],
                         'children': [],
                         'resolutionPath': [
                           {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                           {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                           {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                           {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                           {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                           {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                         ]
                       },
                       {
                         'element': 'app-todos',
                         'component': {'name': 'app-todos', 'isElement': false, 'id': 8},
                         'directives': [],
                         'children': [
                           {
                             'element': 'a',
                             'component': null,
                             'directives': [{'name': '_RouterLink', 'id': 9}],
                             'children': [],
                             'resolutionPath': [
                               {'id': '13', 'type': 'element', 'name': '_RouterLink'},
                               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                             ]
                           },
                           {
                             'element': 'a',
                             'component': null,
                             'directives': [{'name': '_RouterLink', 'id': 10}],
                             'children': [],
                             'resolutionPath': [
                               {'id': '16', 'type': 'element', 'name': '_RouterLink'},
                               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                             ]
                           },
                           {
                             'element': 'a',
                             'component': null,
                             'directives': [{'name': '_RouterLink', 'id': 11}],
                             'children': [],
                             'resolutionPath': [
                               {'id': '17', 'type': 'element', 'name': '_RouterLink'},
                               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                             ]
                           },
                           {
                             'element': 'app-todo',
                             'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
                             'directives': [{'name': '_TooltipDirective', 'id': 13}],
                             'children': [{
                               'element': 'div',
                               'component': null,
                               'directives': [{'name': '_TooltipDirective', 'id': 14}],
                               'children': [],
                               'resolutionPath': [
                                 {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
                                 {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                                 {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                                 {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                                 {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                                 {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                                 {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                                 {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                                 {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                                 {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                                 {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                                 {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                                 {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                                 {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                                 {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                                 {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                               ]
                             }],
                             'resolutionPath': [
                               {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                               {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                             ]
                           },
                           {
                             'element': 'app-todo',
                             'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
                             'directives': [{'name': '_TooltipDirective', 'id': 16}],
                             'children': [{
                               'element': 'div',
                               'component': null,
                               'directives': [{'name': '_TooltipDirective', 'id': 17}],
                               'children': [],
                               'resolutionPath': [
                                 {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
                                 {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                                 {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                                 {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                                 {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                                 {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                                 {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                                 {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                                 {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                                 {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                                 {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                                 {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                                 {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                                 {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                                 {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                                 {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                               ]
                             }],
                             'resolutionPath': [
                               {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                               {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                             ]
                           },
                           {
                             'element': '#comment',
                             'component': null,
                             'directives': [{'name': '_NgForOf', 'id': 18}],
                             'children': [],
                             'resolutionPath': [
                               {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                             ]
                           }
                         ],
                         'resolutionPath': [
                           {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                           {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                           {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                           {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                           {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                           {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                           {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                           {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                         ]
                       }
                     ],
                     'resolutionPath': [
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': 'app-zippy',
                     'component': {'name': 'app-zippy', 'isElement': true, 'id': 19},
                     'directives': [],
                     'children': [],
                     'resolutionPath': [
                       {'id': '23', 'type': 'element', 'name': '_ZippyComponent'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': 'app-heavy',
                     'component': {'name': 'app-heavy', 'isElement': false, 'id': 20},
                     'directives': [],
                     'children': [],
                     'resolutionPath': [
                       {'id': '24', 'type': 'element', 'name': '_HeavyComponent'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   }
                 ],
                 'resolutionPath': [
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               }
             ],
             'resolutionPath': [
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [{'id': '1', 'type': 'element', 'name': '_AppComponent'}]
         },
         {
           'node': {
             'element': 'router-outlet',
             'component': null,
             'directives': [{'name': '_RouterOutlet', 'id': 1}],
             'children': [],
             'resolutionPath': [
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [{'id': '1', 'type': 'element', 'name': '_AppComponent'}]
         },
         {
           'node': {
             'element': 'app-demo-component',
             'component': {'name': 'app-demo-component', 'isElement': false, 'id': 2},
             'directives': [],
             'children': [
               {
                 'element': 'router-outlet',
                 'component': null,
                 'directives': [{'name': '_RouterOutlet', 'id': 3}],
                 'children': [],
                 'resolutionPath': [
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'app-todo-demo',
                 'component': {'name': 'app-todo-demo', 'isElement': false, 'id': 4},
                 'directives': [],
                 'children': [
                   {
                     'element': 'a',
                     'component': null,
                     'directives': [{'name': '_RouterLink', 'id': 5}],
                     'children': [],
                     'resolutionPath': [
                       {'id': '8', 'type': 'element', 'name': '_RouterLink'},
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': 'a',
                     'component': null,
                     'directives': [{'name': '_RouterLink', 'id': 6}],
                     'children': [],
                     'resolutionPath': [
                       {'id': '11', 'type': 'element', 'name': '_RouterLink'},
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': 'router-outlet',
                     'component': null,
                     'directives': [{'name': '_RouterOutlet', 'id': 7}],
                     'children': [],
                     'resolutionPath': [
                       {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': 'app-todos',
                     'component': {'name': 'app-todos', 'isElement': false, 'id': 8},
                     'directives': [],
                     'children': [
                       {
                         'element': 'a',
                         'component': null,
                         'directives': [{'name': '_RouterLink', 'id': 9}],
                         'children': [],
                         'resolutionPath': [
                           {'id': '13', 'type': 'element', 'name': '_RouterLink'},
                           {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                           {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                           {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                           {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                           {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                           {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                           {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                           {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                         ]
                       },
                       {
                         'element': 'a',
                         'component': null,
                         'directives': [{'name': '_RouterLink', 'id': 10}],
                         'children': [],
                         'resolutionPath': [
                           {'id': '16', 'type': 'element', 'name': '_RouterLink'},
                           {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                           {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                           {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                           {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                           {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                           {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                           {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                           {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                         ]
                       },
                       {
                         'element': 'a',
                         'component': null,
                         'directives': [{'name': '_RouterLink', 'id': 11}],
                         'children': [],
                         'resolutionPath': [
                           {'id': '17', 'type': 'element', 'name': '_RouterLink'},
                           {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                           {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                           {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                           {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                           {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                           {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                           {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                           {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                         ]
                       },
                       {
                         'element': 'app-todo',
                         'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
                         'directives': [{'name': '_TooltipDirective', 'id': 13}],
                         'children': [{
                           'element': 'div',
                           'component': null,
                           'directives': [{'name': '_TooltipDirective', 'id': 14}],
                           'children': [],
                           'resolutionPath': [
                             {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
                             {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                             {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                             {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                             {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                             {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                             {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                             {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                             {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                             {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                           ]
                         }],
                         'resolutionPath': [
                           {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                           {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                           {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                           {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                           {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                           {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                           {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                           {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                           {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                           {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                         ]
                       },
                       {
                         'element': 'app-todo',
                         'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
                         'directives': [{'name': '_TooltipDirective', 'id': 16}],
                         'children': [{
                           'element': 'div',
                           'component': null,
                           'directives': [{'name': '_TooltipDirective', 'id': 17}],
                           'children': [],
                           'resolutionPath': [
                             {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
                             {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                             {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                             {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                             {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                             {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                             {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                             {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                             {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                             {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                           ]
                         }],
                         'resolutionPath': [
                           {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                           {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                           {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                           {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                           {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                           {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                           {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                           {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                           {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                           {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                         ]
                       },
                       {
                         'element': '#comment',
                         'component': null,
                         'directives': [{'name': '_NgForOf', 'id': 18}],
                         'children': [],
                         'resolutionPath': [
                           {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                           {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                           {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                           {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                           {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                           {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                           {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                           {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                           {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                         ]
                       }
                     ],
                     'resolutionPath': [
                       {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                       {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   }
                 ],
                 'resolutionPath': [
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'app-zippy',
                 'component': {'name': 'app-zippy', 'isElement': true, 'id': 19},
                 'directives': [],
                 'children': [],
                 'resolutionPath': [
                   {'id': '23', 'type': 'element', 'name': '_ZippyComponent'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'app-heavy',
                 'component': {'name': 'app-heavy', 'isElement': false, 'id': 20},
                 'directives': [],
                 'children': [],
                 'resolutionPath': [
                   {'id': '24', 'type': 'element', 'name': '_HeavyComponent'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               }
             ],
             'resolutionPath': [
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'}
           ]
         },
         {
           'node': {
             'element': 'router-outlet',
             'component': null,
             'directives': [{'name': '_RouterOutlet', 'id': 3}],
             'children': [],
             'resolutionPath': [
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'}
           ]
         },
         {
           'node': {
             'element': 'app-todo-demo',
             'component': {'name': 'app-todo-demo', 'isElement': false, 'id': 4},
             'directives': [],
             'children': [
               {
                 'element': 'a',
                 'component': null,
                 'directives': [{'name': '_RouterLink', 'id': 5}],
                 'children': [],
                 'resolutionPath': [
                   {'id': '8', 'type': 'element', 'name': '_RouterLink'},
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'a',
                 'component': null,
                 'directives': [{'name': '_RouterLink', 'id': 6}],
                 'children': [],
                 'resolutionPath': [
                   {'id': '11', 'type': 'element', 'name': '_RouterLink'},
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'router-outlet',
                 'component': null,
                 'directives': [{'name': '_RouterOutlet', 'id': 7}],
                 'children': [],
                 'resolutionPath': [
                   {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'app-todos',
                 'component': {'name': 'app-todos', 'isElement': false, 'id': 8},
                 'directives': [],
                 'children': [
                   {
                     'element': 'a',
                     'component': null,
                     'directives': [{'name': '_RouterLink', 'id': 9}],
                     'children': [],
                     'resolutionPath': [
                       {'id': '13', 'type': 'element', 'name': '_RouterLink'},
                       {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                       {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': 'a',
                     'component': null,
                     'directives': [{'name': '_RouterLink', 'id': 10}],
                     'children': [],
                     'resolutionPath': [
                       {'id': '16', 'type': 'element', 'name': '_RouterLink'},
                       {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                       {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': 'a',
                     'component': null,
                     'directives': [{'name': '_RouterLink', 'id': 11}],
                     'children': [],
                     'resolutionPath': [
                       {'id': '17', 'type': 'element', 'name': '_RouterLink'},
                       {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                       {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': 'app-todo',
                     'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
                     'directives': [{'name': '_TooltipDirective', 'id': 13}],
                     'children': [{
                       'element': 'div',
                       'component': null,
                       'directives': [{'name': '_TooltipDirective', 'id': 14}],
                       'children': [],
                       'resolutionPath': [
                         {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
                         {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                         {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                         {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                         {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                         {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                         {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                         {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                         {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                         {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                         {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                         {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                         {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                         {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                         {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                         {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                       ]
                     }],
                     'resolutionPath': [
                       {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                       {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                       {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                       {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': 'app-todo',
                     'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
                     'directives': [{'name': '_TooltipDirective', 'id': 16}],
                     'children': [{
                       'element': 'div',
                       'component': null,
                       'directives': [{'name': '_TooltipDirective', 'id': 17}],
                       'children': [],
                       'resolutionPath': [
                         {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
                         {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                         {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                         {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                         {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                         {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                         {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                         {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                         {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                         {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                         {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                         {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                         {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                         {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                         {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                         {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                       ]
                     }],
                     'resolutionPath': [
                       {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                       {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                       {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                       {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': '#comment',
                     'component': null,
                     'directives': [{'name': '_NgForOf', 'id': 18}],
                     'children': [],
                     'resolutionPath': [
                       {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                       {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                       {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   }
                 ],
                 'resolutionPath': [
                   {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                   {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               }
             ],
             'resolutionPath': [
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'}
           ]
         },
         {
           'node': {
             'element': 'a',
             'component': null,
             'directives': [{'name': '_RouterLink', 'id': 5}],
             'children': [],
             'resolutionPath': [
               {'id': '8', 'type': 'element', 'name': '_RouterLink'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'}
           ]
         },
         {
           'node': {
             'element': 'a',
             'component': null,
             'directives': [{'name': '_RouterLink', 'id': 6}],
             'children': [],
             'resolutionPath': [
               {'id': '11', 'type': 'element', 'name': '_RouterLink'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'}
           ]
         },
         {
           'node': {
             'element': 'router-outlet',
             'component': null,
             'directives': [{'name': '_RouterOutlet', 'id': 7}],
             'children': [],
             'resolutionPath': [
               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'}
           ]
         },
         {
           'node': {
             'element': 'app-todos',
             'component': {'name': 'app-todos', 'isElement': false, 'id': 8},
             'directives': [],
             'children': [
               {
                 'element': 'a',
                 'component': null,
                 'directives': [{'name': '_RouterLink', 'id': 9}],
                 'children': [],
                 'resolutionPath': [
                   {'id': '13', 'type': 'element', 'name': '_RouterLink'},
                   {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                   {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'a',
                 'component': null,
                 'directives': [{'name': '_RouterLink', 'id': 10}],
                 'children': [],
                 'resolutionPath': [
                   {'id': '16', 'type': 'element', 'name': '_RouterLink'},
                   {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                   {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'a',
                 'component': null,
                 'directives': [{'name': '_RouterLink', 'id': 11}],
                 'children': [],
                 'resolutionPath': [
                   {'id': '17', 'type': 'element', 'name': '_RouterLink'},
                   {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                   {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'app-todo',
                 'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
                 'directives': [{'name': '_TooltipDirective', 'id': 13}],
                 'children': [{
                   'element': 'div',
                   'component': null,
                   'directives': [{'name': '_TooltipDirective', 'id': 14}],
                   'children': [],
                   'resolutionPath': [
                     {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
                     {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                     {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                     {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                     {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                     {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                     {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                     {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                     {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                     {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                     {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                     {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                     {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                     {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                     {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                     {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                   ]
                 }],
                 'resolutionPath': [
                   {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                   {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                   {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                   {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'app-todo',
                 'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
                 'directives': [{'name': '_TooltipDirective', 'id': 16}],
                 'children': [{
                   'element': 'div',
                   'component': null,
                   'directives': [{'name': '_TooltipDirective', 'id': 17}],
                   'children': [],
                   'resolutionPath': [
                     {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
                     {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                     {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                     {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                     {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                     {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                     {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                     {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                     {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                     {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                     {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                     {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                     {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                     {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                     {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                     {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                   ]
                 }],
                 'resolutionPath': [
                   {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                   {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                   {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                   {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': '#comment',
                 'component': null,
                 'directives': [{'name': '_NgForOf', 'id': 18}],
                 'children': [],
                 'resolutionPath': [
                   {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                   {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                   {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               }
             ],
             'resolutionPath': [
               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
             {'id': '14', 'type': 'element', 'name': '_TodosComponent'}
           ]
         },
         {
           'node': {
             'element': 'a',
             'component': null,
             'directives': [{'name': '_RouterLink', 'id': 9}],
             'children': [],
             'resolutionPath': [
               {'id': '13', 'type': 'element', 'name': '_RouterLink'},
               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
             {'id': '14', 'type': 'element', 'name': '_TodosComponent'}
           ]
         },
         {
           'node': {
             'element': 'a',
             'component': null,
             'directives': [{'name': '_RouterLink', 'id': 10}],
             'children': [],
             'resolutionPath': [
               {'id': '16', 'type': 'element', 'name': '_RouterLink'},
               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
             {'id': '14', 'type': 'element', 'name': '_TodosComponent'}
           ]
         },
         {
           'node': {
             'element': 'a',
             'component': null,
             'directives': [{'name': '_RouterLink', 'id': 11}],
             'children': [],
             'resolutionPath': [
               {'id': '17', 'type': 'element', 'name': '_RouterLink'},
               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
             {'id': '14', 'type': 'element', 'name': '_TodosComponent'}
           ]
         },
         {
           'node': {
             'element': 'app-todo',
             'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
             'directives': [{'name': '_TooltipDirective', 'id': 13}],
             'children': [{
               'element': 'div',
               'component': null,
               'directives': [{'name': '_TooltipDirective', 'id': 14}],
               'children': [],
               'resolutionPath': [
                 {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
                 {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                 {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                 {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                 {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                 {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                 {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                 {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                 {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                 {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                 {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                 {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                 {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                 {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                 {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                 {'id': '4', 'type': 'null', 'name': 'Null Injector'}
               ]
             }],
             'resolutionPath': [
               {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
               {'id': '20', 'type': 'element', 'name': '_NgForOf'},
               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
             {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
             {'id': '19', 'type': 'element', 'name': '_TodoComponent'}
           ]
         },
         {
           'node': {
             'element': 'div',
             'component': null,
             'directives': [{'name': '_TooltipDirective', 'id': 14}],
             'children': [],
             'resolutionPath': [
               {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
               {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
               {'id': '20', 'type': 'element', 'name': '_NgForOf'},
               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
             {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
             {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
             {'id': '18', 'type': 'element', 'name': '_TooltipDirective'}
           ]
         },
         {
           'node': {
             'element': 'app-todo',
             'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
             'directives': [{'name': '_TooltipDirective', 'id': 16}],
             'children': [{
               'element': 'div',
               'component': null,
               'directives': [{'name': '_TooltipDirective', 'id': 17}],
               'children': [],
               'resolutionPath': [
                 {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
                 {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                 {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                 {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                 {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                 {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                 {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                 {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                 {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                 {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                 {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                 {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                 {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                 {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                 {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                 {'id': '4', 'type': 'null', 'name': 'Null Injector'}
               ]
             }],
             'resolutionPath': [
               {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
               {'id': '20', 'type': 'element', 'name': '_NgForOf'},
               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
             {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
             {'id': '22', 'type': 'element', 'name': '_TodoComponent'}
           ]
         },
         {
           'node': {
             'element': 'div',
             'component': null,
             'directives': [{'name': '_TooltipDirective', 'id': 17}],
             'children': [],
             'resolutionPath': [
               {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
               {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
               {'id': '20', 'type': 'element', 'name': '_NgForOf'},
               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
             {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
             {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
             {'id': '21', 'type': 'element', 'name': '_TooltipDirective'}
           ]
         },
         {
           'node': {
             'element': '#comment',
             'component': null,
             'directives': [{'name': '_NgForOf', 'id': 18}],
             'children': [],
             'resolutionPath': [
               {'id': '20', 'type': 'element', 'name': '_NgForOf'},
               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
             {'id': '14', 'type': 'element', 'name': '_TodosComponent'}
           ]
         },
         {
           'node': {
             'element': 'app-zippy',
             'component': {'name': 'app-zippy', 'isElement': true, 'id': 19},
             'directives': [],
             'children': [],
             'resolutionPath': [
               {'id': '23', 'type': 'element', 'name': '_ZippyComponent'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [{'id': '23', 'type': 'element', 'name': '_ZippyComponent'}]
         },
         {
           'node': {
             'element': 'app-heavy',
             'component': {'name': 'app-heavy', 'isElement': false, 'id': 20},
             'directives': [],
             'children': [],
             'resolutionPath': [
               {'id': '24', 'type': 'element', 'name': '_HeavyComponent'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
             {'id': '24', 'type': 'element', 'name': '_HeavyComponent'}
           ]
         }
       ];

       const expectedEnvironmentPaths = [
         {
           'node': {
             'element': 'app-root',
             'component': {'name': 'app-root', 'isElement': false, 'id': 0},
             'directives': [],
             'children': [
               {
                 'element': 'router-outlet',
                 'component': null,
                 'directives': [{'name': '_RouterOutlet', 'id': 1}],
                 'children': [],
                 'resolutionPath': [
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'app-demo-component',
                 'component': {'name': 'app-demo-component', 'isElement': false, 'id': 2},
                 'directives': [],
                 'children': [
                   {
                     'element': 'router-outlet',
                     'component': null,
                     'directives': [{'name': '_RouterOutlet', 'id': 3}],
                     'children': [],
                     'resolutionPath': [
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': 'app-todo-demo',
                     'component': {'name': 'app-todo-demo', 'isElement': false, 'id': 4},
                     'directives': [],
                     'children': [
                       {
                         'element': 'a',
                         'component': null,
                         'directives': [{'name': '_RouterLink', 'id': 5}],
                         'children': [],
                         'resolutionPath': [
                           {'id': '8', 'type': 'element', 'name': '_RouterLink'},
                           {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                           {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                           {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                           {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                           {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                           {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                         ]
                       },
                       {
                         'element': 'a',
                         'component': null,
                         'directives': [{'name': '_RouterLink', 'id': 6}],
                         'children': [],
                         'resolutionPath': [
                           {'id': '11', 'type': 'element', 'name': '_RouterLink'},
                           {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                           {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                           {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                           {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                           {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                           {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                         ]
                       },
                       {
                         'element': 'router-outlet',
                         'component': null,
                         'directives': [{'name': '_RouterOutlet', 'id': 7}],
                         'children': [],
                         'resolutionPath': [
                           {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                           {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                           {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                           {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                           {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                           {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                         ]
                       },
                       {
                         'element': 'app-todos',
                         'component': {'name': 'app-todos', 'isElement': false, 'id': 8},
                         'directives': [],
                         'children': [
                           {
                             'element': 'a',
                             'component': null,
                             'directives': [{'name': '_RouterLink', 'id': 9}],
                             'children': [],
                             'resolutionPath': [
                               {'id': '13', 'type': 'element', 'name': '_RouterLink'},
                               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                             ]
                           },
                           {
                             'element': 'a',
                             'component': null,
                             'directives': [{'name': '_RouterLink', 'id': 10}],
                             'children': [],
                             'resolutionPath': [
                               {'id': '16', 'type': 'element', 'name': '_RouterLink'},
                               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                             ]
                           },
                           {
                             'element': 'a',
                             'component': null,
                             'directives': [{'name': '_RouterLink', 'id': 11}],
                             'children': [],
                             'resolutionPath': [
                               {'id': '17', 'type': 'element', 'name': '_RouterLink'},
                               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                             ]
                           },
                           {
                             'element': 'app-todo',
                             'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
                             'directives': [{'name': '_TooltipDirective', 'id': 13}],
                             'children': [{
                               'element': 'div',
                               'component': null,
                               'directives': [{'name': '_TooltipDirective', 'id': 14}],
                               'children': [],
                               'resolutionPath': [
                                 {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
                                 {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                                 {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                                 {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                                 {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                                 {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                                 {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                                 {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                                 {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                                 {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                                 {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                                 {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                                 {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                                 {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                                 {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                                 {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                               ]
                             }],
                             'resolutionPath': [
                               {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                               {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                             ]
                           },
                           {
                             'element': 'app-todo',
                             'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
                             'directives': [{'name': '_TooltipDirective', 'id': 16}],
                             'children': [{
                               'element': 'div',
                               'component': null,
                               'directives': [{'name': '_TooltipDirective', 'id': 17}],
                               'children': [],
                               'resolutionPath': [
                                 {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
                                 {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                                 {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                                 {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                                 {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                                 {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                                 {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                                 {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                                 {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                                 {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                                 {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                                 {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                                 {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                                 {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                                 {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                                 {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                               ]
                             }],
                             'resolutionPath': [
                               {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                               {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                             ]
                           },
                           {
                             'element': '#comment',
                             'component': null,
                             'directives': [{'name': '_NgForOf', 'id': 18}],
                             'children': [],
                             'resolutionPath': [
                               {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                             ]
                           }
                         ],
                         'resolutionPath': [
                           {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                           {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                           {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                           {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                           {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                           {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                           {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                           {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                         ]
                       }
                     ],
                     'resolutionPath': [
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': 'app-zippy',
                     'component': {'name': 'app-zippy', 'isElement': true, 'id': 19},
                     'directives': [],
                     'children': [],
                     'resolutionPath': [
                       {'id': '23', 'type': 'element', 'name': '_ZippyComponent'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': 'app-heavy',
                     'component': {'name': 'app-heavy', 'isElement': false, 'id': 20},
                     'directives': [],
                     'children': [],
                     'resolutionPath': [
                       {'id': '24', 'type': 'element', 'name': '_HeavyComponent'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   }
                 ],
                 'resolutionPath': [
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               }
             ],
             'resolutionPath': [
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [{'id': '2', 'type': 'environment', 'name': '_AppModule'}]
         },
         {
           'node': {
             'element': 'router-outlet',
             'component': null,
             'directives': [{'name': '_RouterOutlet', 'id': 1}],
             'children': [],
             'resolutionPath': [
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [{'id': '2', 'type': 'environment', 'name': '_AppModule'}]
         },
         {
           'node': {
             'element': 'app-demo-component',
             'component': {'name': 'app-demo-component', 'isElement': false, 'id': 2},
             'directives': [],
             'children': [
               {
                 'element': 'router-outlet',
                 'component': null,
                 'directives': [{'name': '_RouterOutlet', 'id': 3}],
                 'children': [],
                 'resolutionPath': [
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'app-todo-demo',
                 'component': {'name': 'app-todo-demo', 'isElement': false, 'id': 4},
                 'directives': [],
                 'children': [
                   {
                     'element': 'a',
                     'component': null,
                     'directives': [{'name': '_RouterLink', 'id': 5}],
                     'children': [],
                     'resolutionPath': [
                       {'id': '8', 'type': 'element', 'name': '_RouterLink'},
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': 'a',
                     'component': null,
                     'directives': [{'name': '_RouterLink', 'id': 6}],
                     'children': [],
                     'resolutionPath': [
                       {'id': '11', 'type': 'element', 'name': '_RouterLink'},
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': 'router-outlet',
                     'component': null,
                     'directives': [{'name': '_RouterOutlet', 'id': 7}],
                     'children': [],
                     'resolutionPath': [
                       {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': 'app-todos',
                     'component': {'name': 'app-todos', 'isElement': false, 'id': 8},
                     'directives': [],
                     'children': [
                       {
                         'element': 'a',
                         'component': null,
                         'directives': [{'name': '_RouterLink', 'id': 9}],
                         'children': [],
                         'resolutionPath': [
                           {'id': '13', 'type': 'element', 'name': '_RouterLink'},
                           {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                           {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                           {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                           {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                           {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                           {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                           {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                           {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                         ]
                       },
                       {
                         'element': 'a',
                         'component': null,
                         'directives': [{'name': '_RouterLink', 'id': 10}],
                         'children': [],
                         'resolutionPath': [
                           {'id': '16', 'type': 'element', 'name': '_RouterLink'},
                           {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                           {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                           {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                           {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                           {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                           {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                           {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                           {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                         ]
                       },
                       {
                         'element': 'a',
                         'component': null,
                         'directives': [{'name': '_RouterLink', 'id': 11}],
                         'children': [],
                         'resolutionPath': [
                           {'id': '17', 'type': 'element', 'name': '_RouterLink'},
                           {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                           {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                           {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                           {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                           {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                           {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                           {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                           {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                         ]
                       },
                       {
                         'element': 'app-todo',
                         'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
                         'directives': [{'name': '_TooltipDirective', 'id': 13}],
                         'children': [{
                           'element': 'div',
                           'component': null,
                           'directives': [{'name': '_TooltipDirective', 'id': 14}],
                           'children': [],
                           'resolutionPath': [
                             {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
                             {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                             {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                             {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                             {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                             {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                             {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                             {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                             {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                             {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                           ]
                         }],
                         'resolutionPath': [
                           {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                           {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                           {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                           {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                           {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                           {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                           {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                           {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                           {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                           {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                         ]
                       },
                       {
                         'element': 'app-todo',
                         'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
                         'directives': [{'name': '_TooltipDirective', 'id': 16}],
                         'children': [{
                           'element': 'div',
                           'component': null,
                           'directives': [{'name': '_TooltipDirective', 'id': 17}],
                           'children': [],
                           'resolutionPath': [
                             {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
                             {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                             {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                             {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                             {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                             {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                             {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                             {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                             {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                             {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                             {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                             {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                             {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                           ]
                         }],
                         'resolutionPath': [
                           {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                           {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                           {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                           {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                           {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                           {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                           {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                           {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                           {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                           {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                         ]
                       },
                       {
                         'element': '#comment',
                         'component': null,
                         'directives': [{'name': '_NgForOf', 'id': 18}],
                         'children': [],
                         'resolutionPath': [
                           {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                           {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                           {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                           {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                           {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                           {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                           {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                           {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                           {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                           {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                           {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                         ]
                       }
                     ],
                     'resolutionPath': [
                       {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                       {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   }
                 ],
                 'resolutionPath': [
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'app-zippy',
                 'component': {'name': 'app-zippy', 'isElement': true, 'id': 19},
                 'directives': [],
                 'children': [],
                 'resolutionPath': [
                   {'id': '23', 'type': 'element', 'name': '_ZippyComponent'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'app-heavy',
                 'component': {'name': 'app-heavy', 'isElement': false, 'id': 20},
                 'directives': [],
                 'children': [],
                 'resolutionPath': [
                   {'id': '24', 'type': 'element', 'name': '_HeavyComponent'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               }
             ],
             'resolutionPath': [
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'}
           ]
         },
         {
           'node': {
             'element': 'router-outlet',
             'component': null,
             'directives': [{'name': '_RouterOutlet', 'id': 3}],
             'children': [],
             'resolutionPath': [
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'}
           ]
         },
         {
           'node': {
             'element': 'app-todo-demo',
             'component': {'name': 'app-todo-demo', 'isElement': false, 'id': 4},
             'directives': [],
             'children': [
               {
                 'element': 'a',
                 'component': null,
                 'directives': [{'name': '_RouterLink', 'id': 5}],
                 'children': [],
                 'resolutionPath': [
                   {'id': '8', 'type': 'element', 'name': '_RouterLink'},
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'a',
                 'component': null,
                 'directives': [{'name': '_RouterLink', 'id': 6}],
                 'children': [],
                 'resolutionPath': [
                   {'id': '11', 'type': 'element', 'name': '_RouterLink'},
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'router-outlet',
                 'component': null,
                 'directives': [{'name': '_RouterOutlet', 'id': 7}],
                 'children': [],
                 'resolutionPath': [
                   {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'app-todos',
                 'component': {'name': 'app-todos', 'isElement': false, 'id': 8},
                 'directives': [],
                 'children': [
                   {
                     'element': 'a',
                     'component': null,
                     'directives': [{'name': '_RouterLink', 'id': 9}],
                     'children': [],
                     'resolutionPath': [
                       {'id': '13', 'type': 'element', 'name': '_RouterLink'},
                       {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                       {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': 'a',
                     'component': null,
                     'directives': [{'name': '_RouterLink', 'id': 10}],
                     'children': [],
                     'resolutionPath': [
                       {'id': '16', 'type': 'element', 'name': '_RouterLink'},
                       {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                       {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': 'a',
                     'component': null,
                     'directives': [{'name': '_RouterLink', 'id': 11}],
                     'children': [],
                     'resolutionPath': [
                       {'id': '17', 'type': 'element', 'name': '_RouterLink'},
                       {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                       {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': 'app-todo',
                     'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
                     'directives': [{'name': '_TooltipDirective', 'id': 13}],
                     'children': [{
                       'element': 'div',
                       'component': null,
                       'directives': [{'name': '_TooltipDirective', 'id': 14}],
                       'children': [],
                       'resolutionPath': [
                         {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
                         {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                         {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                         {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                         {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                         {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                         {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                         {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                         {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                         {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                         {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                         {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                         {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                         {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                         {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                         {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                       ]
                     }],
                     'resolutionPath': [
                       {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                       {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                       {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                       {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': 'app-todo',
                     'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
                     'directives': [{'name': '_TooltipDirective', 'id': 16}],
                     'children': [{
                       'element': 'div',
                       'component': null,
                       'directives': [{'name': '_TooltipDirective', 'id': 17}],
                       'children': [],
                       'resolutionPath': [
                         {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
                         {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                         {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                         {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                         {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                         {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                         {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                         {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                         {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                         {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                         {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                         {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                         {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                         {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                         {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                         {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                       ]
                     }],
                     'resolutionPath': [
                       {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                       {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                       {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                       {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   },
                   {
                     'element': '#comment',
                     'component': null,
                     'directives': [{'name': '_NgForOf', 'id': 18}],
                     'children': [],
                     'resolutionPath': [
                       {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                       {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                       {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                       {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                       {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                       {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                       {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                       {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                       {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                       {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                       {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                     ]
                   }
                 ],
                 'resolutionPath': [
                   {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                   {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               }
             ],
             'resolutionPath': [
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'}
           ]
         },
         {
           'node': {
             'element': 'a',
             'component': null,
             'directives': [{'name': '_RouterLink', 'id': 5}],
             'children': [],
             'resolutionPath': [
               {'id': '8', 'type': 'element', 'name': '_RouterLink'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'}
           ]
         },
         {
           'node': {
             'element': 'a',
             'component': null,
             'directives': [{'name': '_RouterLink', 'id': 6}],
             'children': [],
             'resolutionPath': [
               {'id': '11', 'type': 'element', 'name': '_RouterLink'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'}
           ]
         },
         {
           'node': {
             'element': 'router-outlet',
             'component': null,
             'directives': [{'name': '_RouterOutlet', 'id': 7}],
             'children': [],
             'resolutionPath': [
               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'}
           ]
         },
         {
           'node': {
             'element': 'app-todos',
             'component': {'name': 'app-todos', 'isElement': false, 'id': 8},
             'directives': [],
             'children': [
               {
                 'element': 'a',
                 'component': null,
                 'directives': [{'name': '_RouterLink', 'id': 9}],
                 'children': [],
                 'resolutionPath': [
                   {'id': '13', 'type': 'element', 'name': '_RouterLink'},
                   {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                   {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'a',
                 'component': null,
                 'directives': [{'name': '_RouterLink', 'id': 10}],
                 'children': [],
                 'resolutionPath': [
                   {'id': '16', 'type': 'element', 'name': '_RouterLink'},
                   {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                   {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'a',
                 'component': null,
                 'directives': [{'name': '_RouterLink', 'id': 11}],
                 'children': [],
                 'resolutionPath': [
                   {'id': '17', 'type': 'element', 'name': '_RouterLink'},
                   {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                   {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'app-todo',
                 'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
                 'directives': [{'name': '_TooltipDirective', 'id': 13}],
                 'children': [{
                   'element': 'div',
                   'component': null,
                   'directives': [{'name': '_TooltipDirective', 'id': 14}],
                   'children': [],
                   'resolutionPath': [
                     {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
                     {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                     {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                     {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                     {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                     {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                     {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                     {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                     {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                     {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                     {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                     {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                     {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                     {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                     {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                     {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                   ]
                 }],
                 'resolutionPath': [
                   {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                   {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                   {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                   {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': 'app-todo',
                 'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
                 'directives': [{'name': '_TooltipDirective', 'id': 16}],
                 'children': [{
                   'element': 'div',
                   'component': null,
                   'directives': [{'name': '_TooltipDirective', 'id': 17}],
                   'children': [],
                   'resolutionPath': [
                     {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
                     {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                     {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                     {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                     {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                     {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                     {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                     {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                     {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                     {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                     {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                     {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                     {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                     {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                     {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                     {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                   ]
                 }],
                 'resolutionPath': [
                   {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                   {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                   {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                   {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               },
               {
                 'element': '#comment',
                 'component': null,
                 'directives': [{'name': '_NgForOf', 'id': 18}],
                 'children': [],
                 'resolutionPath': [
                   {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                   {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                   {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                   {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                   {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                   {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                   {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                   {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                   {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                   {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                   {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                 ]
               }
             ],
             'resolutionPath': [
               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
             {'id': '15', 'type': 'environment', 'name': '_HomeModule'}
           ]
         },
         {
           'node': {
             'element': 'a',
             'component': null,
             'directives': [{'name': '_RouterLink', 'id': 9}],
             'children': [],
             'resolutionPath': [
               {'id': '13', 'type': 'element', 'name': '_RouterLink'},
               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
             {'id': '15', 'type': 'environment', 'name': '_HomeModule'}
           ]
         },
         {
           'node': {
             'element': 'a',
             'component': null,
             'directives': [{'name': '_RouterLink', 'id': 10}],
             'children': [],
             'resolutionPath': [
               {'id': '16', 'type': 'element', 'name': '_RouterLink'},
               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
             {'id': '15', 'type': 'environment', 'name': '_HomeModule'}
           ]
         },
         {
           'node': {
             'element': 'a',
             'component': null,
             'directives': [{'name': '_RouterLink', 'id': 11}],
             'children': [],
             'resolutionPath': [
               {'id': '17', 'type': 'element', 'name': '_RouterLink'},
               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
             {'id': '15', 'type': 'environment', 'name': '_HomeModule'}
           ]
         },
         {
           'node': {
             'element': 'app-todo',
             'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
             'directives': [{'name': '_TooltipDirective', 'id': 13}],
             'children': [{
               'element': 'div',
               'component': null,
               'directives': [{'name': '_TooltipDirective', 'id': 14}],
               'children': [],
               'resolutionPath': [
                 {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
                 {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                 {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                 {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                 {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                 {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                 {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                 {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                 {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                 {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                 {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                 {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                 {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                 {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                 {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                 {'id': '4', 'type': 'null', 'name': 'Null Injector'}
               ]
             }],
             'resolutionPath': [
               {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
               {'id': '20', 'type': 'element', 'name': '_NgForOf'},
               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
             {'id': '15', 'type': 'environment', 'name': '_HomeModule'}
           ]
         },
         {
           'node': {
             'element': 'div',
             'component': null,
             'directives': [{'name': '_TooltipDirective', 'id': 14}],
             'children': [],
             'resolutionPath': [
               {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
               {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
               {'id': '20', 'type': 'element', 'name': '_NgForOf'},
               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
             {'id': '15', 'type': 'environment', 'name': '_HomeModule'}
           ]
         },
         {
           'node': {
             'element': 'app-todo',
             'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
             'directives': [{'name': '_TooltipDirective', 'id': 16}],
             'children': [{
               'element': 'div',
               'component': null,
               'directives': [{'name': '_TooltipDirective', 'id': 17}],
               'children': [],
               'resolutionPath': [
                 {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
                 {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                 {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                 {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                 {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                 {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                 {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                 {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                 {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                 {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                 {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                 {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                 {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                 {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                 {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                 {'id': '4', 'type': 'null', 'name': 'Null Injector'}
               ]
             }],
             'resolutionPath': [
               {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
               {'id': '20', 'type': 'element', 'name': '_NgForOf'},
               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
             {'id': '15', 'type': 'environment', 'name': '_HomeModule'}
           ]
         },
         {
           'node': {
             'element': 'div',
             'component': null,
             'directives': [{'name': '_TooltipDirective', 'id': 17}],
             'children': [],
             'resolutionPath': [
               {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
               {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
               {'id': '20', 'type': 'element', 'name': '_NgForOf'},
               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
             {'id': '15', 'type': 'environment', 'name': '_HomeModule'}
           ]
         },
         {
           'node': {
             'element': '#comment',
             'component': null,
             'directives': [{'name': '_NgForOf', 'id': 18}],
             'children': [],
             'resolutionPath': [
               {'id': '20', 'type': 'element', 'name': '_NgForOf'},
               {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
               {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
               {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
               {'id': '10', 'type': 'environment', 'name': '_AppModule'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
             {'id': '15', 'type': 'environment', 'name': '_HomeModule'}
           ]
         },
         {
           'node': {
             'element': 'app-zippy',
             'component': {'name': 'app-zippy', 'isElement': true, 'id': 19},
             'directives': [],
             'children': [],
             'resolutionPath': [
               {'id': '23', 'type': 'element', 'name': '_ZippyComponent'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'}
           ]
         },
         {
           'node': {
             'element': 'app-heavy',
             'component': {'name': 'app-heavy', 'isElement': false, 'id': 20},
             'directives': [],
             'children': [],
             'resolutionPath': [
               {'id': '24', 'type': 'element', 'name': '_HeavyComponent'},
               {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
               {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
               {'id': '1', 'type': 'element', 'name': '_AppComponent'},
               {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
               {'id': '2', 'type': 'environment', 'name': '_AppModule'},
               {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
               {'id': '4', 'type': 'null', 'name': 'Null Injector'}
             ]
           },
           'path': [
             {'id': '2', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'}
           ]
         }
       ];

       const expectedStartingElementToEnvironmentPath = new Map([
         ['1', [{'id': '2', 'type': 'environment', 'name': '_AppModule'}]],
         [
           '6',
           [
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '2', 'type': 'environment', 'name': '_AppModule'}
           ]
         ],
         [
           '9',
           [
             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '2', 'type': 'environment', 'name': '_AppModule'}
           ]
         ],
         [
           '14',
           [
             {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '2', 'type': 'environment', 'name': '_AppModule'}
           ]
         ],
         [
           '19',
           [
             {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '2', 'type': 'environment', 'name': '_AppModule'}
           ]
         ],
         [
           '18',
           [
             {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '2', 'type': 'environment', 'name': '_AppModule'}
           ]
         ],
         [
           '22',
           [
             {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '2', 'type': 'environment', 'name': '_AppModule'}
           ]
         ],
         [
           '21',
           [
             {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
             {'id': '10', 'type': 'environment', 'name': '_AppModule'},
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '2', 'type': 'environment', 'name': '_AppModule'}
           ]
         ],
         [
           '23',
           [
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '2', 'type': 'environment', 'name': '_AppModule'}
           ]
         ],
         [
           '24',
           [
             {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
             {'id': '2', 'type': 'environment', 'name': '_AppModule'}
           ]
         ]
       ]);

       const {elementPaths, environmentPaths, startingElementToEnvironmentPath} =
           splitInjectorPathsIntoElementAndEnvironmentPaths(injectorPaths);

       expect(elementPaths).toEqual(expectedElementPaths);
       expect(environmentPaths).toEqual(expectedEnvironmentPaths);
       expect(startingElementToEnvironmentPath).toEqual(expectedStartingElementToEnvironmentPath);
     });
});

describe('grabInjectorPathsFromDirectiveForest', () => {
  it('should be able to get a list of injector paths from a directive forest', () => {
    const directiveForest = [{
      'element': 'app-root',
      'component': {'name': 'app-root', 'isElement': false, 'id': 0},
      'directives': [],
      'children': [
        {
          'element': 'router-outlet',
          'component': null,
          'directives': [{'name': '_RouterOutlet', 'id': 1}],
          'children': [],
          'resolutionPath': [
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        {
          'element': 'app-demo-component',
          'component': {'name': 'app-demo-component', 'isElement': false, 'id': 2},
          'directives': [],
          'children': [
            {
              'element': 'router-outlet',
              'component': null,
              'directives': [{'name': '_RouterOutlet', 'id': 3}],
              'children': [],
              'resolutionPath': [
                {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            },
            {
              'element': 'app-todo-demo',
              'component': {'name': 'app-todo-demo', 'isElement': false, 'id': 4},
              'directives': [],
              'children': [
                {
                  'element': 'a',
                  'component': null,
                  'directives': [{'name': '_RouterLink', 'id': 5}],
                  'children': [],
                  'resolutionPath': [
                    {'id': '8', 'type': 'element', 'name': '_RouterLink'},
                    {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                },
                {
                  'element': 'a',
                  'component': null,
                  'directives': [{'name': '_RouterLink', 'id': 6}],
                  'children': [],
                  'resolutionPath': [
                    {'id': '11', 'type': 'element', 'name': '_RouterLink'},
                    {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                },
                {
                  'element': 'router-outlet',
                  'component': null,
                  'directives': [{'name': '_RouterOutlet', 'id': 7}],
                  'children': [],
                  'resolutionPath': [
                    {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                },
                {
                  'element': 'app-todos',
                  'component': {'name': 'app-todos', 'isElement': false, 'id': 8},
                  'directives': [],
                  'children': [
                    {
                      'element': 'a',
                      'component': null,
                      'directives': [{'name': '_RouterLink', 'id': 9}],
                      'children': [],
                      'resolutionPath': [
                        {'id': '13', 'type': 'element', 'name': '_RouterLink'},
                        {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                        {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    },
                    {
                      'element': 'a',
                      'component': null,
                      'directives': [{'name': '_RouterLink', 'id': 10}],
                      'children': [],
                      'resolutionPath': [
                        {'id': '16', 'type': 'element', 'name': '_RouterLink'},
                        {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                        {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    },
                    {
                      'element': 'a',
                      'component': null,
                      'directives': [{'name': '_RouterLink', 'id': 11}],
                      'children': [],
                      'resolutionPath': [
                        {'id': '17', 'type': 'element', 'name': '_RouterLink'},
                        {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                        {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    },
                    {
                      'element': 'app-todo',
                      'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
                      'directives': [{'name': '_TooltipDirective', 'id': 13}],
                      'children': [{
                        'element': 'div',
                        'component': null,
                        'directives': [{'name': '_TooltipDirective', 'id': 14}],
                        'children': [],
                        'resolutionPath': [
                          {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
                          {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                          {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                          {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                          {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                          {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                          {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                        ]
                      }],
                      'resolutionPath': [
                        {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                        {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                        {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                        {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    },
                    {
                      'element': 'app-todo',
                      'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
                      'directives': [{'name': '_TooltipDirective', 'id': 16}],
                      'children': [{
                        'element': 'div',
                        'component': null,
                        'directives': [{'name': '_TooltipDirective', 'id': 17}],
                        'children': [],
                        'resolutionPath': [
                          {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
                          {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                          {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                          {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                          {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                          {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                          {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                        ]
                      }],
                      'resolutionPath': [
                        {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                        {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                        {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                        {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    },
                    {
                      'element': '#comment',
                      'component': null,
                      'directives': [{'name': '_NgForOf', 'id': 18}],
                      'children': [],
                      'resolutionPath': [
                        {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                        {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                        {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    }
                  ],
                  'resolutionPath': [
                    {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                    {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                    {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                }
              ],
              'resolutionPath': [
                {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            },
            {
              'element': 'app-zippy',
              'component': {'name': 'app-zippy', 'isElement': true, 'id': 19},
              'directives': [],
              'children': [],
              'resolutionPath': [
                {'id': '23', 'type': 'element', 'name': '_ZippyComponent'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            },
            {
              'element': 'app-heavy',
              'component': {'name': 'app-heavy', 'isElement': false, 'id': 20},
              'directives': [],
              'children': [],
              'resolutionPath': [
                {'id': '24', 'type': 'element', 'name': '_HeavyComponent'},
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            }
          ],
          'resolutionPath': [
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        }
      ],
      'resolutionPath': [
        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
      ]
    }];

    const expectedInjectorPaths = [
      {
        'node': {
          'element': 'app-root',
          'component': {'name': 'app-root', 'isElement': false, 'id': 0},
          'directives': [],
          'children': [
            {
              'element': 'router-outlet',
              'component': null,
              'directives': [{'name': '_RouterOutlet', 'id': 1}],
              'children': [],
              'resolutionPath': [
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            },
            {
              'element': 'app-demo-component',
              'component': {'name': 'app-demo-component', 'isElement': false, 'id': 2},
              'directives': [],
              'children': [
                {
                  'element': 'router-outlet',
                  'component': null,
                  'directives': [{'name': '_RouterOutlet', 'id': 3}],
                  'children': [],
                  'resolutionPath': [
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                },
                {
                  'element': 'app-todo-demo',
                  'component': {'name': 'app-todo-demo', 'isElement': false, 'id': 4},
                  'directives': [],
                  'children': [
                    {
                      'element': 'a',
                      'component': null,
                      'directives': [{'name': '_RouterLink', 'id': 5}],
                      'children': [],
                      'resolutionPath': [
                        {'id': '8', 'type': 'element', 'name': '_RouterLink'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    },
                    {
                      'element': 'a',
                      'component': null,
                      'directives': [{'name': '_RouterLink', 'id': 6}],
                      'children': [],
                      'resolutionPath': [
                        {'id': '11', 'type': 'element', 'name': '_RouterLink'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    },
                    {
                      'element': 'router-outlet',
                      'component': null,
                      'directives': [{'name': '_RouterOutlet', 'id': 7}],
                      'children': [],
                      'resolutionPath': [
                        {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    },
                    {
                      'element': 'app-todos',
                      'component': {'name': 'app-todos', 'isElement': false, 'id': 8},
                      'directives': [],
                      'children': [
                        {
                          'element': 'a',
                          'component': null,
                          'directives': [{'name': '_RouterLink', 'id': 9}],
                          'children': [],
                          'resolutionPath': [
                            {'id': '13', 'type': 'element', 'name': '_RouterLink'},
                            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                          ]
                        },
                        {
                          'element': 'a',
                          'component': null,
                          'directives': [{'name': '_RouterLink', 'id': 10}],
                          'children': [],
                          'resolutionPath': [
                            {'id': '16', 'type': 'element', 'name': '_RouterLink'},
                            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                          ]
                        },
                        {
                          'element': 'a',
                          'component': null,
                          'directives': [{'name': '_RouterLink', 'id': 11}],
                          'children': [],
                          'resolutionPath': [
                            {'id': '17', 'type': 'element', 'name': '_RouterLink'},
                            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                          ]
                        },
                        {
                          'element': 'app-todo',
                          'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
                          'directives': [{'name': '_TooltipDirective', 'id': 13}],
                          'children': [{
                            'element': 'div',
                            'component': null,
                            'directives': [{'name': '_TooltipDirective', 'id': 14}],
                            'children': [],
                            'resolutionPath': [
                              {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
                              {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                              {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                              {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                              {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                              {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                              {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                              {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                              {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                              {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                              {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                              {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                              {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                            ]
                          }],
                          'resolutionPath': [
                            {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                            {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                          ]
                        },
                        {
                          'element': 'app-todo',
                          'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
                          'directives': [{'name': '_TooltipDirective', 'id': 16}],
                          'children': [{
                            'element': 'div',
                            'component': null,
                            'directives': [{'name': '_TooltipDirective', 'id': 17}],
                            'children': [],
                            'resolutionPath': [
                              {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
                              {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                              {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                              {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                              {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                              {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                              {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                              {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                              {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                              {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                              {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                              {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                              {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                              {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                            ]
                          }],
                          'resolutionPath': [
                            {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                            {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                          ]
                        },
                        {
                          'element': '#comment',
                          'component': null,
                          'directives': [{'name': '_NgForOf', 'id': 18}],
                          'children': [],
                          'resolutionPath': [
                            {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                          ]
                        }
                      ],
                      'resolutionPath': [
                        {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                        {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    }
                  ],
                  'resolutionPath': [
                    {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                },
                {
                  'element': 'app-zippy',
                  'component': {'name': 'app-zippy', 'isElement': true, 'id': 19},
                  'directives': [],
                  'children': [],
                  'resolutionPath': [
                    {'id': '23', 'type': 'element', 'name': '_ZippyComponent'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                },
                {
                  'element': 'app-heavy',
                  'component': {'name': 'app-heavy', 'isElement': false, 'id': 20},
                  'directives': [],
                  'children': [],
                  'resolutionPath': [
                    {'id': '24', 'type': 'element', 'name': '_HeavyComponent'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                }
              ],
              'resolutionPath': [
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            }
          ],
          'resolutionPath': [
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '4', 'type': 'null', 'name': 'Null Injector'},
          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
          {'id': '1', 'type': 'element', 'name': '_AppComponent'}
        ]
      },
      {
        'node': {
          'element': 'router-outlet',
          'component': null,
          'directives': [{'name': '_RouterOutlet', 'id': 1}],
          'children': [],
          'resolutionPath': [
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '4', 'type': 'null', 'name': 'Null Injector'},
          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'}
        ]
      },
      {
        'node': {
          'element': 'app-demo-component',
          'component': {'name': 'app-demo-component', 'isElement': false, 'id': 2},
          'directives': [],
          'children': [
            {
              'element': 'router-outlet',
              'component': null,
              'directives': [{'name': '_RouterOutlet', 'id': 3}],
              'children': [],
              'resolutionPath': [
                {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            },
            {
              'element': 'app-todo-demo',
              'component': {'name': 'app-todo-demo', 'isElement': false, 'id': 4},
              'directives': [],
              'children': [
                {
                  'element': 'a',
                  'component': null,
                  'directives': [{'name': '_RouterLink', 'id': 5}],
                  'children': [],
                  'resolutionPath': [
                    {'id': '8', 'type': 'element', 'name': '_RouterLink'},
                    {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                },
                {
                  'element': 'a',
                  'component': null,
                  'directives': [{'name': '_RouterLink', 'id': 6}],
                  'children': [],
                  'resolutionPath': [
                    {'id': '11', 'type': 'element', 'name': '_RouterLink'},
                    {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                },
                {
                  'element': 'router-outlet',
                  'component': null,
                  'directives': [{'name': '_RouterOutlet', 'id': 7}],
                  'children': [],
                  'resolutionPath': [
                    {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                },
                {
                  'element': 'app-todos',
                  'component': {'name': 'app-todos', 'isElement': false, 'id': 8},
                  'directives': [],
                  'children': [
                    {
                      'element': 'a',
                      'component': null,
                      'directives': [{'name': '_RouterLink', 'id': 9}],
                      'children': [],
                      'resolutionPath': [
                        {'id': '13', 'type': 'element', 'name': '_RouterLink'},
                        {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                        {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    },
                    {
                      'element': 'a',
                      'component': null,
                      'directives': [{'name': '_RouterLink', 'id': 10}],
                      'children': [],
                      'resolutionPath': [
                        {'id': '16', 'type': 'element', 'name': '_RouterLink'},
                        {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                        {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    },
                    {
                      'element': 'a',
                      'component': null,
                      'directives': [{'name': '_RouterLink', 'id': 11}],
                      'children': [],
                      'resolutionPath': [
                        {'id': '17', 'type': 'element', 'name': '_RouterLink'},
                        {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                        {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    },
                    {
                      'element': 'app-todo',
                      'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
                      'directives': [{'name': '_TooltipDirective', 'id': 13}],
                      'children': [{
                        'element': 'div',
                        'component': null,
                        'directives': [{'name': '_TooltipDirective', 'id': 14}],
                        'children': [],
                        'resolutionPath': [
                          {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
                          {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                          {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                          {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                          {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                          {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                          {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                        ]
                      }],
                      'resolutionPath': [
                        {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                        {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                        {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                        {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    },
                    {
                      'element': 'app-todo',
                      'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
                      'directives': [{'name': '_TooltipDirective', 'id': 16}],
                      'children': [{
                        'element': 'div',
                        'component': null,
                        'directives': [{'name': '_TooltipDirective', 'id': 17}],
                        'children': [],
                        'resolutionPath': [
                          {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
                          {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                          {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                          {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                          {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                          {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                          {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                        ]
                      }],
                      'resolutionPath': [
                        {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                        {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                        {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                        {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    },
                    {
                      'element': '#comment',
                      'component': null,
                      'directives': [{'name': '_NgForOf', 'id': 18}],
                      'children': [],
                      'resolutionPath': [
                        {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                        {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                        {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                        {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                        {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                        {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                        {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                        {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                        {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                        {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                        {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                      ]
                    }
                  ],
                  'resolutionPath': [
                    {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                    {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                    {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                }
              ],
              'resolutionPath': [
                {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            },
            {
              'element': 'app-zippy',
              'component': {'name': 'app-zippy', 'isElement': true, 'id': 19},
              'directives': [],
              'children': [],
              'resolutionPath': [
                {'id': '23', 'type': 'element', 'name': '_ZippyComponent'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            },
            {
              'element': 'app-heavy',
              'component': {'name': 'app-heavy', 'isElement': false, 'id': 20},
              'directives': [],
              'children': [],
              'resolutionPath': [
                {'id': '24', 'type': 'element', 'name': '_HeavyComponent'},
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            }
          ],
          'resolutionPath': [
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '4', 'type': 'null', 'name': 'Null Injector'},
          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'}
        ]
      },
      {
        'node': {
          'element': 'router-outlet',
          'component': null,
          'directives': [{'name': '_RouterOutlet', 'id': 3}],
          'children': [],
          'resolutionPath': [
            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '4', 'type': 'null', 'name': 'Null Injector'},
          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'}
        ]
      },
      {
        'node': {
          'element': 'app-todo-demo',
          'component': {'name': 'app-todo-demo', 'isElement': false, 'id': 4},
          'directives': [],
          'children': [
            {
              'element': 'a',
              'component': null,
              'directives': [{'name': '_RouterLink', 'id': 5}],
              'children': [],
              'resolutionPath': [
                {'id': '8', 'type': 'element', 'name': '_RouterLink'},
                {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            },
            {
              'element': 'a',
              'component': null,
              'directives': [{'name': '_RouterLink', 'id': 6}],
              'children': [],
              'resolutionPath': [
                {'id': '11', 'type': 'element', 'name': '_RouterLink'},
                {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            },
            {
              'element': 'router-outlet',
              'component': null,
              'directives': [{'name': '_RouterOutlet', 'id': 7}],
              'children': [],
              'resolutionPath': [
                {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            },
            {
              'element': 'app-todos',
              'component': {'name': 'app-todos', 'isElement': false, 'id': 8},
              'directives': [],
              'children': [
                {
                  'element': 'a',
                  'component': null,
                  'directives': [{'name': '_RouterLink', 'id': 9}],
                  'children': [],
                  'resolutionPath': [
                    {'id': '13', 'type': 'element', 'name': '_RouterLink'},
                    {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                    {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                    {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                },
                {
                  'element': 'a',
                  'component': null,
                  'directives': [{'name': '_RouterLink', 'id': 10}],
                  'children': [],
                  'resolutionPath': [
                    {'id': '16', 'type': 'element', 'name': '_RouterLink'},
                    {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                    {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                    {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                },
                {
                  'element': 'a',
                  'component': null,
                  'directives': [{'name': '_RouterLink', 'id': 11}],
                  'children': [],
                  'resolutionPath': [
                    {'id': '17', 'type': 'element', 'name': '_RouterLink'},
                    {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                    {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                    {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                },
                {
                  'element': 'app-todo',
                  'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
                  'directives': [{'name': '_TooltipDirective', 'id': 13}],
                  'children': [{
                    'element': 'div',
                    'component': null,
                    'directives': [{'name': '_TooltipDirective', 'id': 14}],
                    'children': [],
                    'resolutionPath': [
                      {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
                      {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                      {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                      {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                      {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                      {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                      {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                      {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                      {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                      {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                      {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                      {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                      {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                      {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                      {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                      {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                    ]
                  }],
                  'resolutionPath': [
                    {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                    {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                    {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                    {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                    {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                },
                {
                  'element': 'app-todo',
                  'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
                  'directives': [{'name': '_TooltipDirective', 'id': 16}],
                  'children': [{
                    'element': 'div',
                    'component': null,
                    'directives': [{'name': '_TooltipDirective', 'id': 17}],
                    'children': [],
                    'resolutionPath': [
                      {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
                      {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                      {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                      {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                      {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                      {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                      {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                      {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                      {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                      {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                      {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                      {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                      {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                      {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                      {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                      {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                    ]
                  }],
                  'resolutionPath': [
                    {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                    {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                    {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                    {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                    {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                },
                {
                  'element': '#comment',
                  'component': null,
                  'directives': [{'name': '_NgForOf', 'id': 18}],
                  'children': [],
                  'resolutionPath': [
                    {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                    {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                    {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                    {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                    {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                    {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                    {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                    {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                    {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                    {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                    {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                  ]
                }
              ],
              'resolutionPath': [
                {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            }
          ],
          'resolutionPath': [
            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '4', 'type': 'null', 'name': 'Null Injector'},
          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'}
        ]
      },
      {
        'node': {
          'element': 'a',
          'component': null,
          'directives': [{'name': '_RouterLink', 'id': 5}],
          'children': [],
          'resolutionPath': [
            {'id': '8', 'type': 'element', 'name': '_RouterLink'},
            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '4', 'type': 'null', 'name': 'Null Injector'},
          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
          {'id': '8', 'type': 'element', 'name': '_RouterLink'}
        ]
      },
      {
        'node': {
          'element': 'a',
          'component': null,
          'directives': [{'name': '_RouterLink', 'id': 6}],
          'children': [],
          'resolutionPath': [
            {'id': '11', 'type': 'element', 'name': '_RouterLink'},
            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '4', 'type': 'null', 'name': 'Null Injector'},
          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
          {'id': '11', 'type': 'element', 'name': '_RouterLink'}
        ]
      },
      {
        'node': {
          'element': 'router-outlet',
          'component': null,
          'directives': [{'name': '_RouterOutlet', 'id': 7}],
          'children': [],
          'resolutionPath': [
            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '4', 'type': 'null', 'name': 'Null Injector'},
          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
          {'id': '12', 'type': 'element', 'name': '_RouterOutlet'}
        ]
      },
      {
        'node': {
          'element': 'app-todos',
          'component': {'name': 'app-todos', 'isElement': false, 'id': 8},
          'directives': [],
          'children': [
            {
              'element': 'a',
              'component': null,
              'directives': [{'name': '_RouterLink', 'id': 9}],
              'children': [],
              'resolutionPath': [
                {'id': '13', 'type': 'element', 'name': '_RouterLink'},
                {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            },
            {
              'element': 'a',
              'component': null,
              'directives': [{'name': '_RouterLink', 'id': 10}],
              'children': [],
              'resolutionPath': [
                {'id': '16', 'type': 'element', 'name': '_RouterLink'},
                {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            },
            {
              'element': 'a',
              'component': null,
              'directives': [{'name': '_RouterLink', 'id': 11}],
              'children': [],
              'resolutionPath': [
                {'id': '17', 'type': 'element', 'name': '_RouterLink'},
                {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            },
            {
              'element': 'app-todo',
              'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
              'directives': [{'name': '_TooltipDirective', 'id': 13}],
              'children': [{
                'element': 'div',
                'component': null,
                'directives': [{'name': '_TooltipDirective', 'id': 14}],
                'children': [],
                'resolutionPath': [
                  {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
                  {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                  {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                  {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                  {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                  {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                  {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                  {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                  {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                  {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                  {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                  {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                  {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                  {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                  {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                  {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                ]
              }],
              'resolutionPath': [
                {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
                {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            },
            {
              'element': 'app-todo',
              'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
              'directives': [{'name': '_TooltipDirective', 'id': 16}],
              'children': [{
                'element': 'div',
                'component': null,
                'directives': [{'name': '_TooltipDirective', 'id': 17}],
                'children': [],
                'resolutionPath': [
                  {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
                  {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                  {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                  {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                  {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                  {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                  {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                  {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                  {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                  {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                  {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                  {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                  {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                  {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                  {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                  {'id': '4', 'type': 'null', 'name': 'Null Injector'}
                ]
              }],
              'resolutionPath': [
                {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
                {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            },
            {
              'element': '#comment',
              'component': null,
              'directives': [{'name': '_NgForOf', 'id': 18}],
              'children': [],
              'resolutionPath': [
                {'id': '20', 'type': 'element', 'name': '_NgForOf'},
                {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
                {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
                {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
                {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
                {'id': '1', 'type': 'element', 'name': '_AppComponent'},
                {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
                {'id': '10', 'type': 'environment', 'name': '_AppModule'},
                {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
                {'id': '2', 'type': 'environment', 'name': '_AppModule'},
                {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
                {'id': '4', 'type': 'null', 'name': 'Null Injector'}
              ]
            }
          ],
          'resolutionPath': [
            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '4', 'type': 'null', 'name': 'Null Injector'},
          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
          {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
          {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '14', 'type': 'element', 'name': '_TodosComponent'}
        ]
      },
      {
        'node': {
          'element': 'a',
          'component': null,
          'directives': [{'name': '_RouterLink', 'id': 9}],
          'children': [],
          'resolutionPath': [
            {'id': '13', 'type': 'element', 'name': '_RouterLink'},
            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '4', 'type': 'null', 'name': 'Null Injector'},
          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
          {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
          {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
          {'id': '13', 'type': 'element', 'name': '_RouterLink'}
        ]
      },
      {
        'node': {
          'element': 'a',
          'component': null,
          'directives': [{'name': '_RouterLink', 'id': 10}],
          'children': [],
          'resolutionPath': [
            {'id': '16', 'type': 'element', 'name': '_RouterLink'},
            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '4', 'type': 'null', 'name': 'Null Injector'},
          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
          {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
          {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
          {'id': '16', 'type': 'element', 'name': '_RouterLink'}
        ]
      },
      {
        'node': {
          'element': 'a',
          'component': null,
          'directives': [{'name': '_RouterLink', 'id': 11}],
          'children': [],
          'resolutionPath': [
            {'id': '17', 'type': 'element', 'name': '_RouterLink'},
            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '4', 'type': 'null', 'name': 'Null Injector'},
          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
          {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
          {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
          {'id': '17', 'type': 'element', 'name': '_RouterLink'}
        ]
      },
      {
        'node': {
          'element': 'app-todo',
          'component': {'name': 'app-todo', 'isElement': false, 'id': 12},
          'directives': [{'name': '_TooltipDirective', 'id': 13}],
          'children': [{
            'element': 'div',
            'component': null,
            'directives': [{'name': '_TooltipDirective', 'id': 14}],
            'children': [],
            'resolutionPath': [
              {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
              {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
              {'id': '20', 'type': 'element', 'name': '_NgForOf'},
              {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
              {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
              {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
              {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
              {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
              {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
              {'id': '1', 'type': 'element', 'name': '_AppComponent'},
              {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
              {'id': '10', 'type': 'environment', 'name': '_AppModule'},
              {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
              {'id': '2', 'type': 'environment', 'name': '_AppModule'},
              {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
              {'id': '4', 'type': 'null', 'name': 'Null Injector'}
            ]
          }],
          'resolutionPath': [
            {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
            {'id': '20', 'type': 'element', 'name': '_NgForOf'},
            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '4', 'type': 'null', 'name': 'Null Injector'},
          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
          {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
          {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
          {'id': '20', 'type': 'element', 'name': '_NgForOf'},
          {'id': '19', 'type': 'element', 'name': '_TodoComponent'}
        ]
      },
      {
        'node': {
          'element': 'div',
          'component': null,
          'directives': [{'name': '_TooltipDirective', 'id': 14}],
          'children': [],
          'resolutionPath': [
            {'id': '18', 'type': 'element', 'name': '_TooltipDirective'},
            {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
            {'id': '20', 'type': 'element', 'name': '_NgForOf'},
            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '4', 'type': 'null', 'name': 'Null Injector'},
          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
          {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
          {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
          {'id': '20', 'type': 'element', 'name': '_NgForOf'},
          {'id': '19', 'type': 'element', 'name': '_TodoComponent'},
          {'id': '18', 'type': 'element', 'name': '_TooltipDirective'}
        ]
      },
      {
        'node': {
          'element': 'app-todo',
          'component': {'name': 'app-todo', 'isElement': false, 'id': 15},
          'directives': [{'name': '_TooltipDirective', 'id': 16}],
          'children': [{
            'element': 'div',
            'component': null,
            'directives': [{'name': '_TooltipDirective', 'id': 17}],
            'children': [],
            'resolutionPath': [
              {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
              {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
              {'id': '20', 'type': 'element', 'name': '_NgForOf'},
              {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
              {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
              {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
              {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
              {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
              {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
              {'id': '1', 'type': 'element', 'name': '_AppComponent'},
              {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
              {'id': '10', 'type': 'environment', 'name': '_AppModule'},
              {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
              {'id': '2', 'type': 'environment', 'name': '_AppModule'},
              {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
              {'id': '4', 'type': 'null', 'name': 'Null Injector'}
            ]
          }],
          'resolutionPath': [
            {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
            {'id': '20', 'type': 'element', 'name': '_NgForOf'},
            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '4', 'type': 'null', 'name': 'Null Injector'},
          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
          {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
          {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
          {'id': '20', 'type': 'element', 'name': '_NgForOf'},
          {'id': '22', 'type': 'element', 'name': '_TodoComponent'}
        ]
      },
      {
        'node': {
          'element': 'div',
          'component': null,
          'directives': [{'name': '_TooltipDirective', 'id': 17}],
          'children': [],
          'resolutionPath': [
            {'id': '21', 'type': 'element', 'name': '_TooltipDirective'},
            {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
            {'id': '20', 'type': 'element', 'name': '_NgForOf'},
            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '4', 'type': 'null', 'name': 'Null Injector'},
          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
          {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
          {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
          {'id': '20', 'type': 'element', 'name': '_NgForOf'},
          {'id': '22', 'type': 'element', 'name': '_TodoComponent'},
          {'id': '21', 'type': 'element', 'name': '_TooltipDirective'}
        ]
      },
      {
        'node': {
          'element': '#comment',
          'component': null,
          'directives': [{'name': '_NgForOf', 'id': 18}],
          'children': [],
          'resolutionPath': [
            {'id': '20', 'type': 'element', 'name': '_NgForOf'},
            {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
            {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
            {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
            {'id': '10', 'type': 'environment', 'name': '_AppModule'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '4', 'type': 'null', 'name': 'Null Injector'},
          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
          {'id': '10', 'type': 'environment', 'name': '_AppModule'},
          {'id': '15', 'type': 'environment', 'name': '_HomeModule'},
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
          {'id': '5', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '9', 'type': 'element', 'name': '_AppTodoComponent'},
          {'id': '12', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '14', 'type': 'element', 'name': '_TodosComponent'},
          {'id': '20', 'type': 'element', 'name': '_NgForOf'}
        ]
      },
      {
        'node': {
          'element': 'app-zippy',
          'component': {'name': 'app-zippy', 'isElement': true, 'id': 19},
          'directives': [],
          'children': [],
          'resolutionPath': [
            {'id': '23', 'type': 'element', 'name': '_ZippyComponent'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '4', 'type': 'null', 'name': 'Null Injector'},
          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
          {'id': '23', 'type': 'element', 'name': '_ZippyComponent'}
        ]
      },
      {
        'node': {
          'element': 'app-heavy',
          'component': {'name': 'app-heavy', 'isElement': false, 'id': 20},
          'directives': [],
          'children': [],
          'resolutionPath': [
            {'id': '24', 'type': 'element', 'name': '_HeavyComponent'},
            {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
            {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
            {'id': '1', 'type': 'element', 'name': '_AppComponent'},
            {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
            {'id': '2', 'type': 'environment', 'name': '_AppModule'},
            {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
            {'id': '4', 'type': 'null', 'name': 'Null Injector'}
          ]
        },
        'path': [
          {'id': '4', 'type': 'null', 'name': 'Null Injector'},
          {'id': '3', 'type': 'environment', 'name': 'Platform: core'},
          {'id': '2', 'type': 'environment', 'name': '_AppModule'},
          {'id': '7', 'type': 'environment', 'name': '_DemoAppModule'},
          {'id': '1', 'type': 'element', 'name': '_AppComponent'},
          {'id': '0', 'type': 'element', 'name': '_RouterOutlet'},
          {'id': '6', 'type': 'element', 'name': '_DemoAppComponent'},
          {'id': '24', 'type': 'element', 'name': '_HeavyComponent'}
        ]
      }
    ];

    expect(grabInjectorPathsFromDirectiveForest(directiveForest)).toEqual(expectedInjectorPaths);
  });
});
