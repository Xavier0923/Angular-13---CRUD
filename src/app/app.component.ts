import { ApiService } from './services/api.service';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  displayedColumns: string[] = ['id', 'productName', 'category', 'date', 'freshness', 'price', 'comment', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  title = 'angular-CRUD';

  constructor(private dialog: MatDialog, private api: ApiService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAllProducts();
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '30%',
    }).afterClosed().subscribe((val => {
      if(val === 'save'){
        this.getAllProducts();
      }
    }));
  }

  editDialog(rowData: any){
    this.dialog.open(DialogComponent, {
      width: '30%',
      data: rowData
    }).afterClosed().subscribe((val => {
      if(val === 'update'){
        this.getAllProducts();
      }
    }));
  }

  getAllProducts(){
    this.api.getProduct()
    .subscribe({
      next: (res) => {
        console.log('get ProductList Success!!', res);
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.error('error', err);
      }
    })
  }

  deleteProduct(id: number){
    console.log('id', id);
    this.api.deleteProduct(id)
    .subscribe({
      next: (res) => {
        console.log('product delete success!!');
        this.getAllProducts();
      },
      error: (err) => {
        console.error('error', err);
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
