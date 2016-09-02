import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmallBox, SmallBoxModel } from '../../../components';
import {
  StatusModel, StatusModelResourceServer, StatusModelResourceDatabase,
  Container, StatusService, ApisService, ApisModel, ApisModelResource,
  ConsumerService, ConsumersModel, ConsumerModelResource, State, SYMBOLS,
  makeSymbolPath, KongModel
} from '../../../shared';

@Component({
  moduleId: __filename,
  selector: 'home',
  templateUrl: './home.template.html',
  providers: [StatusService, ApisService, ConsumerService],
  directives: [SmallBox]
})
export class HomeContainer extends Container implements OnInit, OnDestroy {
  boxModel: Array<SmallBoxModel>;
  apisModel: Array<ApisModelResource>;
  consumersModel: Array<ConsumerModelResource>;
  kongModel: KongModel;

  constructor(
    private _appState: State,
    private _apisService: ApisService,
    private _statusService: StatusService,
    private _consumerService: ConsumerService
  ) {
    super();
  }

  ngOnInit() {
    this.subscriptions = this._statusService.status()
      .subscribe((statusModel: StatusModel) => {
        let server = <StatusModelResourceServer>statusModel.getAttribute('server');
        let db = <StatusModelResourceDatabase>statusModel.getAttribute('database');

        this.boxModel = [
          {
            info: 'Requests',
            title: server.total_requests.toString(),
            icon: 'ion ion-stats-bars',
            classBg: 'small-box bg-aqua'
          },
          {
            info: 'Connections',
            title: server.connections_accepted.toString(),
            icon: 'ion ion-log-in',
            classBg: 'small-box bg-green'
          },
          {
            info: 'Connections Active',
            title: server.connections_active.toString(),
            icon: 'ion ion-ios-pulse-strong',
            classBg: 'small-box bg-yellow'
          },
          {
            info: 'Apis',
            title: db.apis.toString(),
            icon: 'ion ion-ios-analytics',
            classBg: 'small-box bg-red'
          },
          {
            info: 'Plugins',
            title: db.plugins.toString(),
            icon: 'fa fa-plug',
            classBg: 'small-box bg-red'
          },
          {
            info: 'Nodes',
            title: db.nodes.toString(),
            icon: 'fa fa-cubes',
            classBg: 'small-box bg-yellow'
          },
          {
            info: 'ACLS',
            title: db.acls.toString(),
            icon: 'fa fa-shield',
            classBg: 'small-box bg-green'
          },
          {
            info: 'Consumers',
            title: db.consumers.toString(),
            icon: 'fa fa-spoon',
            classBg: 'small-box bg-aqua'
          }
        ];
      });

    this.subscriptions = this._apisService.apis()
      .subscribe((apisModel: ApisModel) => {
        this.apisModel = apisModel.collection.data;
      });

    this.subscriptions = this._consumerService.consumers()
      .subscribe((consumerModel: ConsumersModel) => {
        this.consumersModel = consumerModel.collection.data;
      });

    this.kongModel = this._appState.get(makeSymbolPath([SYMBOLS.DATA, SYMBOLS.MODELS.KONG]));
  }

  ngOnDestroy() {
    this.clean();
  }
}