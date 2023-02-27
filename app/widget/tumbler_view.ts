/**
 * Opinionated representation of a TumblerView widget
 */
export default class TumblerView {
  private readonly views: TumblerViewConfig;
  private readonly onActive?: OnActiveCallback;
  private readonly onSelect?: OnSelectCallback;
  private ranges: TumblerRangeConfig;

  private currentLeftValue: number;
  private currentRightValue: number;

  constructor(config: TumblerConfig) {
    this.views = config.views;
    this.ranges = config.ranges;
    this.onActive = config.onActive;
    this.onSelect = config.onSelect;

    if (this.ranges != null) {
      this.resequence(this.ranges);
    }

    this.initListeners();
  }

  private initListeners = () => {
    this.views.left.addEventListener('mouseup', () => {
      this.fireOnActive();
    });

    this.views.right.addEventListener('mouseup', () => {
      this.fireOnActive();
    });

    this.views.left.addEventListener('select', () => {
      let selectedIndex = this.views.left.value;
      let selectedItem = this.views.left.getElementById(`left-item${selectedIndex}`);
      let selectedValue = selectedItem.getElementById('text').text;
      this.currentLeftValue = parseInt(selectedValue);
      this.fireOnSelect();
    });

    this.views.right.addEventListener('select', () => {
      let selectedIndex = this.views.right.value;
      let selectedItem = this.views.right.getElementById(`right-item${selectedIndex}`);
      let selectedValue = selectedItem.getElementById('text').text;
      this.currentRightValue = parseInt(selectedValue);
      this.fireOnSelect();
    });
  };

  private wrapAroundSequence = (data: TumblerValue) => {
    const rangeLower = data.range.lower;
    const rangeUpper = data.range.upper;
    const rangeSteps = rangeUpper - rangeLower + 1;

    const sequence = [];
    for (let i = 0; i < rangeSteps; i++) {
      const value = (data.value + i) % (rangeUpper + 1);
      sequence.push(value < rangeLower ? value + rangeLower : value);
    }

    return {
      steps: rangeSteps,
      sequences: sequence,
    };
  };

  resequence = (data: TumblerRangeConfig) => {
    this.currentLeftValue = data.left.value;
    this.currentRightValue = data.right.value;

    const sequences = this.wrapAroundSequence(data.left);
    for (let i = 0; i < sequences.steps; i++) {
      this.views.left.getElementById(`left-item${i}`).getElementById('text').text = `${sequences.sequences[i]}`;
    }

    const sequencesRight = this.wrapAroundSequence(data.right);
    for (let i = 0; i < sequencesRight.steps; i++) {
      this.views.right.getElementById(`right-item${i}`).getElementById('text').text = `${sequencesRight.sequences[i]}`;
    }
  };

  getCurrentValue = (): number => {
    return parseFloat(`${this.currentLeftValue}.${this.currentRightValue}`);
  };

  private fireOnSelect = () => {
    if (this.onSelect !== null) {
      this.onSelect(this.getCurrentValue());
    }
  };

  private fireOnActive = () => {
    if (this.onActive !== null) {
      this.onActive();
    }
  };
}

type OnSelectCallback = (value: number) => void;

type OnActiveCallback = () => void;

interface TumblerConfig {
  views: TumblerViewConfig;
  ranges?: TumblerRangeConfig;
  onActive?: OnActiveCallback;
  onSelect?: OnSelectCallback;
}

interface TumblerViewConfig {
  left: Element;
  right: Element;
}

interface TumblerRangeConfig {
  left: TumblerValue;
  right: TumblerValue;
}

interface TumblerValue {
  value: number;
  range: Range;
}

interface Range {
  upper: number;
  lower: number;
}
