import document from 'document';

/**
 * A basic module to simplify navigation within multi-view applications.
 *
 * Credit: https://github.com/gaperton/sdk-multi-view
 */
export class Viewport {
  private _views: ViewList;
  private _unmount: void | Function;
  private _history: ViewName[] = [];
  private _options = [];
  private _currentOptions;

  initialize(views: ViewList) {
    this._views = views;
  }

  // Currently selected view name.
  private current: ViewName = null;

  /**
   * Navigate to a specific view using its view name
   * 
   * @param {ViewName} viewName The name of a .view file, excluding its path or file extension.
   * @param {object} options Object with options to be passed to view's render() function.
   */
  replace(viewName: ViewName, options?: any): void {
    if (this._unmount) {
      this._unmount();
    }

    const view = this._views[viewName];

    if (view == null) {
      console.error(`Failed to find view JS: ${viewName}`);
    }

    document.location.assign(`./resources/views/${viewName}.view`).then(() => {
      if (this._history.length) {
        document.addEventListener('keypress', (evt) => {
          if (evt.key === 'back') {
            evt && evt.preventDefault();
            this.back();
          }
        });
      }

      this.current = viewName;
      this._currentOptions = options;
      this._unmount = this._views[viewName]().render(this, options);
    });
  }

  /**
   * Push the view as subview, so back button can be used to navigate back
   */
  push(viewName: ViewName, options?): void {
    this._history.push(this.current);
    this._options.push(this._currentOptions);

    this.replace(viewName, options);
  }

  /**
   * Handle back navigation for view port
   */
  back(): void {
    this.replace(this._history.pop(), this._options.pop());
  }
}

type ViewName = string;

/**
 * Representation of the view list for the viewport
 */
interface ViewList {
  [key: ViewName]: () => View;
}

/**
 * Representation of a view
 */
export abstract class View {
  /**
   * Get the element of the view by ID
   * 
   * @param id The ID of the view
   * @returns The GraphicsElement of the specified view ID
   */
  getViewById(id: string): GraphicsElement {
    return document.getElementById(id) as GraphicsElement;
  }

  /**
   * Get the element of the view by ID within parent view ID
   * 
   * @param withinId The parent view ID to find the view ID within
   * @param id The ID of the view
   * @returns The GraphicsElement of the specified view ID
   */
  getViewWithinById(withinId: string, id: string): GraphicsElement {
    return document.getElementById(withinId).getElementById(id) as GraphicsElement;
  }

  abstract render(viewport: Viewport, options?: any): void | Function;
}

const viewport = new Viewport();

export default viewport;
