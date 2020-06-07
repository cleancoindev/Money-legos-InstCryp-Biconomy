import React, { Component } from 'react';
import { Button, Form, Input, Segment, Grid, Dropdown, Message, Icon, Divider, Label } from 'semantic-ui-react';
import web3 from '../../biconomyProvider/realweb3';
import web3Biconomy from '../../biconomyProvider/web3Biconomy';
import {
  getUniswapV2Router,
  getERCContractInstance,
  TokenInfoArray,
  PairInfoArray,
  getUniswapV2Factory, 
  tagOptions
} from '../../config/swapconfig/contractinstances';
import { ToastContainer, toast } from 'react-toastify';

class Liquidity extends Component {
    state = {
        addLiquidityLoading: false,
        removeLiquidityLoading: false,
        routeraddress: '0xf164fC0Ec4E93095b804a4795bBe1e041497b92a',
        liquidityToken0: '',
        liquidityToken1: '',
        addLiquidityamount0: '',
        addLiquidityamount1: '',
        removeTokenPair: '',
        removeLiquidityTokenAmount: '',
        minValue: 0
    }

    createPair = async () => {
        event.preventDefault();
        try {
            const accounts = await web3.eth.getAccounts();
            const factoryInstance = await getUniswapV2Factory(web3);
            const pair = await factoryInstance.methods.getPair(this.state.createToken0, this.state.createToken1).call();
            if(pair == "0x0000000000000000000000000000000000000000") {
                await factoryInstance.methods.createPair(
                    this.state.createToken0,
                    this.state.createToken1
                ).send({
                    from: accounts[0]
                });
            } else {
                toast.error("This Pair is already exit!!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        } catch (error) {
            console.log(error)
        }
    }; 

    selectMax = async () => {
        event.preventDefault();
        try {
            // const factoryInstance = await getUniswapV2Factory(web3);
            // const pair = await factoryInstance.methods.getPair("0xaD6D458402F60fD3Bd25163575031ACDce07538D","0x4E470dc7321E84CA96FcAEDD0C8aBCebbAEB68C6").call();
            // console.log(pair);
            if (this.state.removeTokenPair!=""){
                const accounts = await web3.eth.getAccounts();
                const erc20ContractInstance1 = await getERCContractInstance(web3, this.state.removeTokenPair);
                const poolTokenBalance = await erc20ContractInstance1.methods.balanceOf(accounts[0]).call();
                this.setState({
                    removeLiquidityTokenAmount: poolTokenBalance
                });
            } else {
                toast.error("Please select token pair!!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        } catch (error) {
            
        }
    };
    
    removeLiquidity = async () => {
        event.preventDefault();
        try {
            this.setState({removeLiquidityLoading: true});
            const accounts = await web3.eth.getAccounts();
            const erc20ContractInstance1 = await getERCContractInstance(web3Biconomy, this.state.removeTokenPair);
            const poolTokenBalance = await erc20ContractInstance1.methods.balanceOf("0x6fC3D06462A5518EA370D0E4Bd1525649CE0fC6c").call();
            if(parseInt(poolTokenBalance) >= parseInt(this.state.removeLiquidityTokenAmount)) {
                
                const allowancePair = await erc20ContractInstance1.methods.allowance("0x6fC3D06462A5518EA370D0E4Bd1525649CE0fC6c", this.state.routeraddress).call();

                if(parseInt(allowancePair) < parseInt(this.state.removeLiquidityTokenAmount)) {
                    await erc20ContractInstance1.methods.approve(
                        this.state.routeraddress,
                        this.state.removeLiquidityTokenAmount
                    ).send({
                        from: accounts[0]
                    });
                }

                const routeContractInstance = await getUniswapV2Router(web3Biconomy);
                await routeContractInstance.methods.removeLiquidity(
                    TokenInfoArray[0][this.state.liquidityToken0].token_contract_address,
                    TokenInfoArray[0][this.state.liquidityToken1].token_contract_address,
                    this.state.removeLiquidityTokenAmount,
                    this.state.minValue,
                    this.state.minValue,
                    accounts[0],
                    Math.floor(new Date().getTime()/1000) + 86400
                ).send({
                    from:accounts[0]
                });
                this.setState({removeLiquidityLoading: false});
                toast.success("Successfully removed liquidity!!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            } else {
                toast.error("You don't have " + this.state.removeLiquidityTokenAmount  + " liquidity to remove. Please enter valid liquidity!!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            this.setState({removeLiquidityLoading: false});
        } catch(error) {
            this.setState({removeLiquidityLoading: false});
            console.log(error);
        }
      };
    
    addLiquidity = async () => {
        event.preventDefault();
        try {
            this.setState({addLiquidityLoading: true});
            const accounts = await web3.eth.getAccounts();
            alert(this.state.liquidityToken0);
            alert(this.state.liquidityToken1)
            const erc20ContractInstance1 = await getERCContractInstance(web3Biconomy, this.state.liquidityToken0);
            const erc20ContractInstance2 = await getERCContractInstance(web3Biconomy, this.state.liquidityToken1);
            const balance0 = await erc20ContractInstance1.methods.balanceOf("0x6fC3D06462A5518EA370D0E4Bd1525649CE0fC6c").call();
            const balance1 = await erc20ContractInstance2.methods.balanceOf("0x6fC3D06462A5518EA370D0E4Bd1525649CE0fC6c").call();
        
            if(parseInt(balance0) >= parseInt(this.state.addLiquidityamount0) && parseInt(this.state.addLiquidityamount0) > parseInt(this.state.minValue)) {
            
                if(parseInt(balance1) >= parseInt(this.state.addLiquidityamount1) && parseInt(this.state.addLiquidityamount1) > parseInt(this.state.minValue)) {
                    const allowanceToken0 = await erc20ContractInstance1.methods.allowance("0x6fC3D06462A5518EA370D0E4Bd1525649CE0fC6c", this.state.routeraddress).call();
                    const allowanceToken1 = await erc20ContractInstance2.methods.allowance("0x6fC3D06462A5518EA370D0E4Bd1525649CE0fC6c", this.state.routeraddress).call();
                    if(parseInt(allowanceToken0) < parseInt(this.state.addLiquidityamount0)) {
                        
                        alert("2")
                        await erc20ContractInstance1.methods.approve(
                            this.state.routeraddress,  
                            this.state.addLiquidityamount0
                        ).send({
                            from: accounts[0]
                        });    
                        alert("1")
                    }
                    
                    if(parseInt(allowanceToken1) < parseInt(this.state.addLiquidityamount1)) {
                        
                        alert("3")
                        await erc20ContractInstance2.methods.approve(
                            this.state.routeraddress,
                            this.state.addLiquidityamount1
                        ).send({
                            from: accounts[0]
                        });
                        alert("jj")
                    }
                    alert("4")
                    const routeContractInstance = await getUniswapV2Router(web3Biconomy);
                    await routeContractInstance.methods.addLiquidity(
                        TokenInfoArray[0][this.state.liquidityToken0].token_contract_address,
                        TokenInfoArray[0][this.state.liquidityToken1].token_contract_address,
                        this.state.addLiquidityamount0,
                        this.state.addLiquidityamount1,
                        this.state.minValue,
                        this.state.minValue,
                        accounts[0],
                        Math.floor(new Date().getTime()/1000) + 86400
                    ).send({
                        from:accounts[0]
                    });
                    toast.success("Successfully added liquidity!!", {
                        position: toast.POSITION.TOP_RIGHT
                      });
                    this.setState({addLiquidityLoading: false});
                    } else {
                    this.setState({addLiquidityLoading: false});
                    toast.error("Insufficeient " + this.state.liquidityToken0 + " balance or add valid value in wei!" , {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            } else {
                this.setState({addLiquidityLoading: false});
                toast.error("Insufficeient " + this.state.liquidityToken1 + " balance or add valid value in wei!" , {
                position: toast.POSITION.TOP_RIGHT
                });
            } 
        } catch (error) {
          this.setState({addLiquidityLoading: false});
          console.log(error);
        }
    };
    
    handleLiquidityPairs =  (e, { value }) => {
        console.log(PairInfoArray[0][value])
        this.setState({ 
            liquidityToken0: PairInfoArray[0][value].token0, 
            liquidityToken1: PairInfoArray[0][value].token1
        });
    };

    handleRemovePairTokens  =  (e, { value }) => {
        this.setState({ 
            liquidityToken0: PairInfoArray[0][value].token0, 
            liquidityToken1: PairInfoArray[0][value].token1,
            removeTokenPair: value 
        });
    };



    render() {
        return(
            <Grid.Column>
                <Label as="a" tag color="green">
                    For Liquidity Providers
                </Label>
                <Segment color="green" textAlign="center">
                
                <Form onSubmit={this.addLiquidity}>
                    <Form.Field>
                        <Message color="green">
                            <Message.Header>Add Liquidity</Message.Header>
                        </Message>
                    </Form.Field>
                    <Form.Field>
                        <Dropdown
                            style={{margin: "0 auto", display: "block"}}
                            options={tagOptions}
                            onChange={this.handleLiquidityPairs} 
                            fluid selection
                            placeholder="Select Pair tokens.."
                        />
                    </Form.Field>
                    <Form.Field>
                        <Input
                            type = "input"
                            labelPosition="right"
                            label="token0 value in WEI"
                            value={this.state.addLiquidityamount0}
                            onChange={event => 
                                this.setState({
                                    addLiquidityamount0: event.target.value,
                            })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Input
                            type = "input"
                            labelPosition="right"
                            label="token1 value in WEI"
                            value={this.state.addLiquidityamount1}
                            onChange={event => 
                                this.setState({
                                    addLiquidityamount1: event.target.value,
                            })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Button 
                            color="green"
                            bsStyle="primary" 
                            type="submit"
                            loading={this.state.addLiquidityLoading}
                            style={{width:"280px", height:"40px"}}> 
                            <Icon name="add circle"></Icon>
                            Add Liquidity
                        </Button>
                    </Form.Field>
                </Form>
                </Segment>
                <Divider></Divider>
                <Segment color="red" textAlign="center">
                <Form onSubmit={this.selectMax}>
                    <Message color="red">
                        <Message.Header>Remove Liquidity</Message.Header>
                    </Message>
                    <Form.Field>
                    <Input
                        label={
                            <Dropdown
                                value={this.state.removeTokenPair} 
                                options={tagOptions}
                                onChange={this.handleRemovePairTokens} 
                            />
                        }
                        type = "input"
                        labelPosition="right"
                        placeholder="Add Pool value in wei"
                        value={this.state.removeLiquidityTokenAmount}
                        onChange={event => 
                            this.setState({
                                removeLiquidityTokenAmount: event.target.value,
                        })}
                    />
                    </Form.Field>
                    <Form.Field>
                        <Button 
                            color="pink"
                            bsStyle="primary" 
                            basic
                            type="submit"
                            style={{width:"280px", height:"40px"}}>  
                            Set Max
                        </Button>
                    </Form.Field>
                </Form>
                <Form onSubmit={this.removeLiquidity} style={{marginTop: "20px"}}>
                    <Form.Field>
                        <Button 
                            color="red"
                            bsStyle="primary" 
                            type="submit"
                            loading={this.state.removeLiquidityLoading}
                            style={{width:"280px", height:"40px"}}>  
                            <Icon name="remove circle"></Icon>
                            Remove Liquidity
                        </Button>
                    </Form.Field>
                </Form>
                </Segment>
                {/* <Divider></Divider>
                <Segment color="yellow">
                <Form onSubmit={this.createPair} >
                    <Message color="yellow">
                        <Message.Header>Create Pair</Message.Header>
                        You can create more pair to create liquidity. 
                    </Message>
                    <Form.Field>
                        <Input
                            color="teal"
                            type = "input"
                            placeholder="token0 address"
                            value={this.state.createToken0}
                            onChange={event => 
                                this.setState({
                                    createToken0: event.target.value,
                            })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Input
                            color="teal"
                            type = "input"
                            placeholder="token1 address"
                            value={this.state.createToken1}
                            onChange={event => 
                                this.setState({
                                    createToken1: event.target.value,
                            })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Button 
                            color="yellow"
                            bsStyle="primary" 
                            type="submit"
                            loading={this.state.createPairLoading}
                            style={{width:"280px", height:"40px"}}>  
                            <Icon name="arrow alternate circle up"> </Icon>
                            CreatePair
                        </Button>
                    </Form.Field>
                </Form>
                </Segment> */}
            </Grid.Column>

        );
    }

};

export default Liquidity; 