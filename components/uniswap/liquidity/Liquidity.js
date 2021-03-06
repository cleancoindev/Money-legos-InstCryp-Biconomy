import React from 'react';
import {
  Button, Input, Dropdown,
} from 'semantic-ui-react';

const Liquidity = ({
  addLiquidity, tagOptions, handleLiquidityPairs,
  addLiquidityamount0, addLiquidityamount1,
  addLiquidityLoading, selectMax, removeTokenPair,
  handleRemovePairTokens, removeLiquidityTokenAmount,
  removeLiquidity, removeLiquidityLoading, handleState,
}) => (
  <div className="liquidity">
    <div className="add-liquidity card">
      <h4>For Liquidity Providers</h4>
      <h3>Add Liquidity</h3>
      <div className="form-field">
        <label className="field-label">Pair tokens</label>
        <Dropdown
          className="liquidity-pairs form-control"
          options={tagOptions}
          onChange={handleLiquidityPairs}
          fluid
          selection
          placeholder="Select Pair tokens.."
        />
      </div>
      <div className="form-field">
        <label className="field-label">token0</label>
        <Input
          type="input"
          // labelPosition="right"
          className="form-control"
          placeholder="token0 value in WEI"
          value={addLiquidityamount0}
          onChange={(event) => {
            handleState({
              addLiquidityamount0: event.target.value,
            });
          }}
          fluid
        />
      </div>
      <div className="form-field">
        <label className="field-label">token1</label>
        <Input
          type="input"
          // labelPosition="right"
          fluid
          className="form-control"
          placeholder="token1 value in WEI"
          value={addLiquidityamount1}
          onChange={(event) => {
            handleState({
              addLiquidityamount1: event.target.value,
            });
          }}
        />
      </div>
      <div className="form-field button add-liquidity-footer">
        <Button
          color="green"
          bsStyle="primary"
          type="submit"
          loading={addLiquidityLoading}
          primary
          onClick={(event) => addLiquidity(event)}
        >
          Add Liquidity
        </Button>
      </div>
    </div>

    <div className="remove-liquidity card">
      <h3>Remove Liquidity</h3>
      <div className="pool-wrapper">
        <div className="form-field ">
          <label className="field-label">token0</label>
          <Input
            label={(
              <Dropdown
                value={removeTokenPair}
                options={tagOptions}
                onChange={handleRemovePairTokens}
                className="form-control pool-dropdown"
                placeholder="Select"
              />
            )}
            fluid
            className="form-control"
            type="input"
            labelPosition="left"
            placeholder="Add Pool value in wei"
            value={removeLiquidityTokenAmount}
            onChange={(event) => {
              handleState({
                removeLiquidityTokenAmount: event.target.value,
              });
            }}
          />
        </div>
        <div className="button set-max-btn">
          <Button
            bsStyle="primary"
            basic
            type="submit"
            onClick={() => selectMax()}
          >
            Set Max
          </Button>
        </div>
      </div>
      <div className="form-field button remove-liquidity-footer">
        <Button
          bsStyle="primary"
          type="submit"
          loading={removeLiquidityLoading}
          primary
          onClick={(event) => removeLiquidity(event)}
        >
          Remove Liquidity
        </Button>
      </div>
    </div>
  </div>
);

export default Liquidity;
