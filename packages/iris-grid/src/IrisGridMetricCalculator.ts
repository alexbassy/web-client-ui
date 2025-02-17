import { GridMetricCalculator, ModelSizeMap } from '@deephaven/grid';
import type { GridMetricState } from '@deephaven/grid';
import type { FilterCondition, Sort } from '@deephaven/jsapi-shim';
import { TableUtils } from '@deephaven/jsapi-utils';
import type IrisGridModel from './IrisGridModel';
import { IrisGridThemeType } from './IrisGridTheme';

export interface IrisGridMetricState extends GridMetricState {
  model: IrisGridModel;
  theme: IrisGridThemeType;
  isFilterBarShown: boolean;
  advancedFilters: Map<
    string,
    { options: unknown; filter: FilterCondition | null }
  >;
  quickFilters: Map<string, { text: string; filter: FilterCondition | null }>;
  sorts: Sort[];
  reverseType: string;
}

/**
 * Class to calculate all the metrics for a grid.
 * Call getMetrics() with the state to get metrics
 */
class IrisGridMetricCalculator extends GridMetricCalculator {
  getGridY(state: IrisGridMetricState): number {
    let gridY = super.getGridY(state);
    const {
      isFilterBarShown,
      theme,
      advancedFilters,
      quickFilters,
      sorts,
      reverseType,
    } = state;
    if (isFilterBarShown) {
      gridY += theme.filterBarHeight;
    } else if (
      (quickFilters != null && quickFilters.size > 0) ||
      (advancedFilters != null && advancedFilters.size > 0)
    ) {
      gridY += theme.filterBarCollapsedHeight;
    }
    if (
      reverseType !== TableUtils.REVERSE_TYPE.NONE &&
      sorts != null &&
      sorts.length > 0
    ) {
      gridY += theme.reverseHeaderBarHeight;
    }

    return gridY;
  }

  getUserColumnWidths(): ModelSizeMap {
    return this.userColumnWidths;
  }
}

export default IrisGridMetricCalculator;
