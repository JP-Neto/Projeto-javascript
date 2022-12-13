const studentModal = document.querySelector('#student-modal');
const studentForm = document.querySelector('#student-form');
const studentModalTitle = document.querySelector('#student-modal-title')
const saveStudentButton = document.querySelector('#save-student')
const subjectModal = document.querySelector('#subject-modal');
const subjectModaltitle = document.querySelector('#subjectModaltitle');
const saveSubjectButton = document.querySelector('#save-subject');
const subjectForm = document.querySelector('#subject-form');


/**
 * Função responsável abrir o modais
 */
const openStudentModal = () => studentModal.showModal();
const openSubjectModal = () => subjectModal.showModal();
/**
 * Função responsável fechar o modais
 */
const closeStudentModal = () => studentModal.close();
const closesubjectModal = () => subjectModal.close();
 

/**
 * Função responsável por criar linhas na tabela student-table
 * @param {nome} string
 * @param {matricula} string
 * @param {curso} string
 * @param {id} string
 */

const loadStudentTable = () => {
  fetch('http://localhost:3000/alunos')
  .then(resp => resp.json())
  .then(data => {
    data.forEach(item => {
      createStudentTableRow(item.nome, item.matricula, item.curso, item.id)
    })
  }).catch((error) => {
    alert('ocorreu um erro tente mais tarde')
    console.error(error);
  });
};
const createStudentTableRow = (nome, matricula, curso, id) => {
  const studentTable = document.querySelector('#student-table tbody')
  const tableTr = document.createElement('tr');
  tableTr.innerHTML = ` 
  <td>${nome}</td>
  <td>${matricula}</td>
  <td>${curso}</td>
  <td align="center">
    <button class="button button--danger" onclick=deleteStudentTable(${id})>Apagar</button>
    <button class="button button--success" onclick="editdStudentModal(${id})">Editar</button>
  </td>`;
  studentTable.appendChild(tableTr);
}

/**
 * Função responsável savar os dados de um estudante
 * @param {url} string
 * @param {method} string
 */
const saveStundentData = (url, method) => {
  studentForm.addEventListener('submit', (event)=> {
    event.preventDefault();
    const formData = new FormData(studentForm);
    const payload = new URLSearchParams(formData);
    fetch(url, {
        method: method,
        body: payload
    })
    .catch(error => {
        closeStudentModal();
        alert('ocorreu um erro tente mais tarde')
        console.error(error);
    })
    // const inputs = document.querySelectorAll('input') // pega todos os iputs
    // console.log(inputs[0].value) // acessa o primeiro indice do array de inputs
  });
}

/**
 * Função responsável abrir o modal de aluno e disciplina e salvar
 * @param {studentId} string
 * @param {subjectId} string
 * */

const createStudent = () => {
  openStudentModal();
  studentModalTitle.textContent = 'Novo Aluno';
  saveStudentButton.textContent = 'Criar';
  saveStundentData('http://localhost:3000/alunos',  'POST');
}

const createSubject = () => {
  openSubjectModal();
  subjectModaltitle.textContent = 'Novo disciplina';
  saveSubjectButton.textContent = 'Criar';
  saveSubjectData('http://localhost:3000/disciplinas', 'POST');
}

/**
 * Função responsável abrir o modal de edição e carregar os dados de um estudante e salvar os dados da edição
 * @param {studentId} string
 */
 const editdStudentModal = async (studentId)  => {
  const url = `http://localhost:3000/alunos/${studentId}`;
  openStudentModal();
  studentModalTitle.textContent='Editar aluno';
  saveStudentButton.textContent = 'Editar';
  const [name, matricula] = document.querySelectorAll('input');
  const selectCurso =  document.querySelector("#curso");
  fetch(url)
  .then(resp => resp.json())
  .then(data => {
    name.value = data.nome
    matricula.value = data.matricula
    selectCurso.value =  data.curso
  })
  saveStundentData(url,  'PUT');
 };


const editSubjectModal = async(subjectId)=>{
  const url=`http://localhost:3000/disciplinas/${subjectId}`;
  openSubjectModal();
  subjectModaltitle.textContent ='Editar Disciplina';

}

/**
 * Função responsável por apagar dados de um estutande
 * @param {studentId} string
 */
const deleteStudentTable = async (studentId)  =>  
  fetch(`http://localhost:3000/alunos/${studentId}`, {method : 'DELETE'});

/**
 * Função responsável por carregar os dados da student-table
 */

function loadSubjectCard() {
  fetch('http://localhost:3000/disciplinas')
    .then(resp => resp.json())
    .then(data => {
      data.forEach(item => {
        createSubjectCard(item.nomeDisciplina, item.carga_horaria, item.professor, item.status,item.descricao, item.id)
      })
    }).catch(error => {
      alert('ocorreu um erro ao carregar, tente mais tarde')
      console.error(error);
    });
}

function createSubjectCard(nomeDisciplina, carga_horaria, professor, status, descricao, id) {
  const subjectCard = document.querySelector('#subjectCardList')
  const subjectDiv = document.createElement('div');
  subjectDiv.innerHTML = ` 
    <div class="subject-card">
      <h3 class="subject-card__title">${nomeDisciplina}</h3>
        <hr />
        <ul class="subject-card__list">
          <li>carga horária: ${carga_horaria}</li>
          <li>Professor: ${professor}</li>
          <li>Status <span class="tag ${status === 'Opcional' ? 'tag--success' : 'tag--danger'}">${status}</span></li>
        </ul>
        <p>${descricao}.</p>
        <div class="subject-card_button">
          <button class="button button--danger subject-button_space" onclick=deleteSubjectCard(${id})>Apagar</button>
          <button class="button button--success" onclick="editdSubjectModal(${id})">Editar</button>
        </div>
    </div>
    `;
  subjectCard.appendChild(subjectDiv);
}

const clearSubjectCards = () => {
  const studentTableBody = document.querySelector('#subjectCardList');
  studentTableBody.innerHTML = '';
}
const editdSubjectModal = async (studentId)  => {
  const url = `http://localhost:3000/disciplinas/${studentId}`;
  openSubjectModal();
  subjectModaltitle.textContent='Editar disciplina';
  saveSubjectButton.textContent = 'Editar';
  const name =  document.querySelector('#nomeDisciplina');
  const cargaHoraria =  document.querySelector('#carga_horaria');
  const professor =  document.querySelector('#professor');
  const selectStatus =  document.querySelector("#status");
  const textAreaObs = document.querySelector('#descricao');
  fetch(url)
  .then(resp => resp.json())
  .then(data => {
    name.value = data.nomeDisciplina
    cargaHoraria.value = data.carga_horaria
    professor.value = data.professor
    selectStatus.value =  data.status
    textAreaObs.value = data.descricao
  })
  saveSubjectData(url,  'PUT');
};

const saveSubjectData = (url, method) => {
  subjectForm.addEventListener('submit', (event)=> {
    event.preventDefault();
    const formData = new FormData(subjectForm);
    const payload = new URLSearchParams(formData);
    fetch(url, {
        method: method,
        body: payload
    })
    .then(() => {
      subjectForm.reset();
      closesubjectModal();
      clearSubjectCards();
      loadSubjectCard();
    })
    .catch(error => {
      closeStudentModal();
        alert('ocorreu um erro tente mais tarde')
        console.error(error);
    })
  });
}

function deleteSubjectCard(cardId) {
  fetch(`http://localhost:3000/disciplinas/${cardId}`, {method : 'DELETE'})
  .then(() => {
    clearSubjectCards();
    loadSubjectCard();
  })
  .catch(error => {
    alert('ocorreu um erro tente mais tarde');
    console.error(error);
  });
}

loadStudentTable();
loadSubjectCard();




