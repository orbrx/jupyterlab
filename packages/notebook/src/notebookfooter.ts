/*
 * Copyright (c) Jupyter Development Team.
 * Distributed under the terms of the Modified BSD License.
 */

import { Widget } from '@lumino/widgets';
import { Message } from '@lumino/messaging';
import { Notebook } from './widget';
import { NotebookActions } from './actions';
import { LabIcon } from '@jupyterlab/ui-components';

import addNewCodeCellSvgstr from '../style/icons/code.svg';
import addNewMarkdownCellSvgstr from '../style/icons/markdown.svg';
import addNewSqlCellSvgstr from '../style/icons/sql.svg';
import addNewAiCellSvgstr from '../style/icons/mito-ai.svg';

const NOTEBOOK_FOOTER_CLASS = 'jp-Notebook-footer';

const addNewCodeCellIcon = new LabIcon({
  name: 'notebookfooter:add-new-code-cell',
  svgstr: addNewCodeCellSvgstr
});
const addNewMarkdownCellIcon = new LabIcon({
  name: 'notebookfooter:add-new-markdown-cell',
  svgstr: addNewMarkdownCellSvgstr
});

const addNewSqlCellIcon = new LabIcon({
  name: 'notebookfooter:add-new-sql-cell',
  svgstr: addNewSqlCellSvgstr
});

const addNewAiCellIcon = new LabIcon({
  name: 'notebookfooter:add-new-ai-cell',
  svgstr: addNewAiCellSvgstr
});

/**
 * A footer widget added after the last cell of the notebook.
 */
export class NotebookFooter extends Widget {
  /**
   * Construct a footer widget.
   */
  constructor(protected notebook: Notebook) {
    super({ node: document.createElement('div') });
    const trans = notebook.translator.load('jupyterlab');
    this.addClass(NOTEBOOK_FOOTER_CLASS);
    this.node.setAttribute('tabindex', '-1');

    // Create a container for the buttons
    const buttonContainer = document.createElement('div');
    this.node.appendChild(buttonContainer);

    // Create the AI button
    const aiButton = document.createElement('button');
    aiButton.addEventListener('click', () => this.onAiClick());
    const aiIconNode = addNewAiCellIcon.element({
      title: trans.__('Generate a new code cell using AI')
    });
    aiButton.appendChild(aiIconNode);
    const aiText = document.createElement('span');
    aiText.textContent = trans.__('Mito AI');
    aiButton.appendChild(aiText);

    // Create a separator
    const separator = document.createElement('span');
    separator.classList.add('jp-Toolbar-separator'); // or any class name you prefer

    // Create the SQL button
    const sqlButton = document.createElement('button');
    sqlButton.addEventListener('click', () => this.onSqlClick());
    const sqlIconNode = addNewSqlCellIcon.element({
      title: trans.__('Add a new SQL cell')
    });
    sqlButton.appendChild(sqlIconNode);
    const sqlText = document.createElement('span');
    sqlText.textContent = trans.__('SQL');
    sqlButton.appendChild(sqlText);

    // Create the code button
    const codeButton = document.createElement('button');
    codeButton.addEventListener('click', () => this.onCodeClick());
    const codeIconNode = addNewCodeCellIcon.element({
      title: trans.__('Add a new code cell')
    });
    codeButton.appendChild(codeIconNode);
    const codeText = document.createElement('span');
    codeText.textContent = trans.__('Code');
    codeButton.appendChild(codeText);

    // Create the markdown button
    const markdownButton = document.createElement('button');
    markdownButton.addEventListener('click', () => this.onMarkdownClick());
    const markdownIconNode = addNewMarkdownCellIcon.element({
      title: trans.__('Add a new markdown cell')
    });
    markdownButton.appendChild(markdownIconNode);
    const markdownText = document.createElement('span');
    markdownText.textContent = trans.__('Markdown');
    markdownButton.appendChild(markdownText);

    // Append buttons to the container
    buttonContainer.appendChild(aiButton);
    buttonContainer.appendChild(separator);
    buttonContainer.appendChild(sqlButton);
    buttonContainer.appendChild(codeButton);
    buttonContainer.appendChild(markdownButton);
  }

  /**
   * Handle single click for adding a code cell.
   */
  protected onCodeClick(): void {
    this.insertCell('code');
  }

  /**
   * Handle single click for adding a markdown cell.
   */
  protected onMarkdownClick(): void {
    this.insertCell('markdown');
  }

  /**
   * Handle single click for adding an AI cell.
   */
  protected onAiClick(): void {
    // Insert a new code cell at the end of the notebook
    if (this.notebook.widgets.length > 0) {
      this.notebook.activeCellIndex = this.notebook.widgets.length - 1;
    }
    NotebookActions.insertBelow(this.notebook, 'code');
    void NotebookActions.focusActiveCell(this.notebook);

    // Now set the content of the newly created cell
    if (this.notebook.activeCell && this.notebook.activeCell.model) {
      this.notebook.activeCell.model.sharedModel.setSource(
        '# AI generated code placeholder'
      );
    }
  }

  /**
   * Handle single click for adding a SQL cell (prepopulated with `%%sql`).
   */
  protected onSqlClick(): void {
    // Insert a new code cell at the end of the notebook
    if (this.notebook.widgets.length > 0) {
      this.notebook.activeCellIndex = this.notebook.widgets.length - 1;
    }
    NotebookActions.insertBelow(this.notebook, 'code');
    void NotebookActions.focusActiveCell(this.notebook);

    // Now set the content of the newly created cell
    if (this.notebook.activeCell && this.notebook.activeCell.model) {
      this.notebook.activeCell.model.sharedModel.setSource('%%sql\n');
    }
  }

  /**
   * Insert a cell of the specified type below (at the end of the notebook as default behavior).
   */
  private insertCell(cellType: 'code' | 'markdown'): void {
    if (this.notebook.widgets.length > 0) {
      this.notebook.activeCellIndex = this.notebook.widgets.length - 1;
    }
    NotebookActions.insertBelow(this.notebook, cellType);
    void NotebookActions.focusActiveCell(this.notebook);
  }

  /*
   * Handle `after-detach` messages for the widget.
   */
  protected onAfterAttach(msg: Message): void {
    super.onAfterAttach(msg);
  }

  /**
   * Handle `before-detach` messages for the widget.
   */
  protected onBeforeDetach(msg: Message): void {
    super.onBeforeDetach(msg);
  }
}
