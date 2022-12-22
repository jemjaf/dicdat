import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatTable} from "@angular/material/table";
import {Word} from "../shared/word.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DiccionarioService} from "../shared/diccionario.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-creacion',
  templateUrl: './creacion.component.html',
  styleUrls: ['./creacion.component.css']
})
export class CreacionComponent implements OnInit {
  form: FormGroup;
  @Input() word:Word= new Word();
  @Output() onSubmit: EventEmitter<any>= new EventEmitter();
  displayedColumns: string[] = ['posicion', 'palabra'];
  dataSource: Word[] = [];
  number = 0;
  tamCombinaciones= 1;
  palabraInicio = "";
  minCombinaciones=1;
  panelOpenState= false;

  @ViewChild(MatTable) table: MatTable<Word>;
  constructor(private formBuilder:FormBuilder, public diccionarioService: DiccionarioService) {
  }

  formatLabel(value: number) {
    if (value >= 1) {
      return Math.round(value / 1) + '';
    }
    return value;
  }

  getMaximo(){
    return this.number;
  }

  getActual(){
    if(this.tamCombinaciones<3 || this.number<this.tamCombinaciones){
      return this.number;
    }else{
      return this.tamCombinaciones
    }
  }

  setTamagnos(){
    if(this.tamCombinaciones<2){
      this.tamCombinaciones=this.number;
    }
    if(this.minCombinaciones>this.tamCombinaciones){
      this.minCombinaciones = this.tamCombinaciones;
    }
  }

  ngOnInit(): void {
    this.form= this.formBuilder.group({
      palabra: [
        this.word.palabra, [
          Validators.required,
        ]
      ],
    })
  }

  addData() {
    const localWord: Word= new Word();
    this.number++;
    localWord.posicion= this.number;
    localWord.palabra= this.form.value.palabra;
    localWord.palabra= localWord.palabra.replace(/ /g,"");
    if(!(localWord.palabra=="")){
      this.dataSource.push(localWord);
      this.table.renderRows();
    }
    this.form.reset();
  }

  removeData() {
    this.number--;
    this.dataSource.pop();
    this.table.renderRows();
  }

  descargar() {
    console.log("queremos decargar")
    this.setedarDatos()
  }

  setedarDatos(){

    this.setTamagnos()

    let listaPalabras = [];
    for (let p of this.dataSource.values()){
      listaPalabras.push(p.palabra);
    }

    this.diccionarioService.setPalabras(this.tamCombinaciones ,this.minCombinaciones, this.palabraInicio, listaPalabras).subscribe(()=>{
      Swal.fire({
        icon: 'question',
        title: '¿Quiere descargar el archivo?',
        padding: '3em',
        showCancelButton:true,
        cancelButtonColor:'#d33',
        cancelButtonText:'cancelar',
        confirmButtonText:'Descargar',
        confirmButtonColor:'#3085d6',

      }).then(respuesta =>{
        if(respuesta.value){
          Swal.fire({
            title:"Su archivo se está generando",
            didOpen: () => {
              Swal.showLoading()
            }
          })
          this.diccionarioService.getDccionario().subscribe((data:any)=>{
            Swal.fire({
              icon: 'success',
              title: 'Archivo creado',
              showConfirmButton: false,
              timer: 2500
            })
            this.generarArchivo(data)
            this.reiniciarDatos()
          },(error:any)=>{
            Swal.fire({
              icon: 'error',
              title: 'No se ha podido descargar su archivo',
              showConfirmButton: false,
              timer: 2500
            })
          })
        }
      })

    },(error:any)=>{
      Swal.fire({
        icon: 'error',
        title: 'No se han podido cargar los datos',
        showConfirmButton: false,
        timer: 2500
        })
      }
    )
  }

  reiniciarDatos(){
    this.dataSource=this.dataSource.slice(0,0);
    this.palabraInicio="";
    this.number=0;
    this.tamCombinaciones=2;
  }

  generarArchivo(data: any){
    var today = new Date();
    var time =today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
    var element = document.createElement('a');

    let combo=""
    for (let palabra of data){
      combo+=palabra;
    }
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(combo));
    element.setAttribute('download', "dicDat-"+time+".txt");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  agregarDatos(evento:KeyboardEvent){
    if(evento.key=="Enter" && this.form.value.palabra.length>0){
      this.addData()
    }
  }
}
