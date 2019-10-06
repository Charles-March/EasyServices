import { Component } from '@angular/core';
import { UseExampleService } from './use-example.service';
import { ExampleModel } from './models/model';
import { ExamplePageModel } from './models/page-model';
@Component({
  selector: 'app-use-example',
  templateUrl: './use-example.component.html',
  styleUrls: ['./use-example.component.scss']
})
export class UseExampleComponent {
  _entities: ExampleModel[];
  _selected: ExampleModel;

  constructor(private readonly useExampleService: UseExampleService) {
    useExampleService.initRepository(
      'http://localhost:1880/default-model',
      ExampleModel,
      ExamplePageModel,
      true
    );
    useExampleService.entityPage$.subscribe(page => {
      if (page) {
        this._entities = page.data;
      }
    });

    useExampleService.selectedEntity.subscribe(selected => {
      this._selected = selected;
    });

    useExampleService.list();
  }

  selectOne(entity: ExampleModel) {
    console.log(entity.id);
    this.useExampleService.find(entity.id, true);
  }

  post(foo: string, bar: string) {
    const model = new ExampleModel(foo, bar);
    this.useExampleService.create(model);
  }

  put(id: string, foo: string, bar: string) {
    this.useExampleService.update(id, new ExampleModel(foo, bar));
  }

  reloadList() {
    this.useExampleService.list();
  }
  delete(id: string) {
    this.useExampleService.delete(id);
  }
}
