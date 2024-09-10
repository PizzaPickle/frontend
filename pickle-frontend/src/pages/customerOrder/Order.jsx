import React, { useEffect, useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Header from '../../components/common/header/Header';
import { Modal, Button } from 'react-bootstrap';
import Sidebar from '../../components/common/sidebar/Sidebar';
import { fetchStockPrices } from '../portfolio/fetchStockPrices';
import {StyledHomeMainContent,
        StyledInputGroup,
        StyledButton,
        StyledFormControl,
        SecondHeader,
        ArrowIcon,
        Previous,
        StrategyName,
        StyledContent,
        CategoryName,
        Category,
        OrderButton,
        StyledHomeContent


        } from "./Order.style";
import { StyledHomeContainer } from '../Homepage/HomePage.style'
import StrategyBox from '../../components/common/order/StrategyBox';
import { Database } from 'lucide-react';
import { MdSouth } from 'react-icons/md';

export default function Order() {
    
    const dispatch = useDispatch();
    const { prices: stockPrices } = useSelector((state) => state.stockPrices);
    const [show, setShow] = useState(false);
    const [orderShow, setOrderShow] = useState(false);
    const [data, setData] = useState([]); 
    const [stocksPrices, setsStockPrices] = useState({});
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);
    const [inputValue, setInputValue]=useState('10,000,000');
    const { token } = useSelector((state) => state.user);
    const [triggerHeldQuantities, setTriggerHeldQuantities]=useState(0);
    const [stockIds, setStockIds] = useState({});
    const [orderResult, setOrderResult] = useState(0);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleOrderClose = () => setOrderShow(false);
    const handleOrderShow = () => setOrderShow(true);
    const [amounts, setAmounts]=useState([]);
    const [applyClicked, setApplyClicked] = useState(false);
    const handleAmountChange = (updatedAmounts) => {
        setAmounts(prevAmounts => ({
            ...prevAmounts,
            ...updatedAmounts
        })); // 업데이트된 amounts를 저장
    };

    // const formatNumber = (value) => {
    //     if (!value) return '';
    //     const [integer, decimal] = value.split('.');
    //     return integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (decimal ? '.' + decimal : '');
    // };

    const handleChange = (e) => {
        const rawValue = e.target.value.replace(/,/g, ''); 
        setInputValue(formatNumber(rawValue));
    };
    const parseFormattedNumber = (value) => {
        // 쉼표를 제거하고 숫자로 변환
        return parseInt(value.replace(/,/g, ''), 10);
      };

    const handlePriceChange = (newPrices) => {
    setsStockPrices(prevPrices => ({
        ...prevPrices,
        ...newPrices
    }));
    };

    
    useEffect(() => {
        const fetchData = async () => {
            try {
                
                const response = await fetch(`/api/pickle-customer/trade/products/1`, {
                    method: 'GET', 
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                console.log(result);
                setData(result); 
            } catch (error) {
                setError(error); 
            } finally {
                setLoading(false); 
            }
        };

        fetchData(); 
    },[]);



    useEffect(()=>{

        if (data) {
            const codes = data.flatMap(category => 
                category.productList.map(product => product.code)
            );
            setStockIds(codes);
        }
       
    }, [data]);
    const handleButtonClick = () => {
        setApplyClicked(true);
        handleClose();
        setTriggerHeldQuantities(prev => prev + 1); // triggerHeldQuantities 값을 증가시켜 변화를 감지
    };

    useEffect(() => {
        const fetchOrderResult = async () => {
            const formattedInputValue = parseFormattedNumber(inputValue);
            try {
                const response = await fetch('api/pickle-customer/trade/price', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        price: formattedInputValue,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                
                setOrderResult(result.price);
            } catch (error) {
                throw new Error('fail');
                
            }
        };

        if (inputValue) {
            fetchOrderResult();
        }
    }, [inputValue]);
    function formatNumber(number) {
        const numStr = number.toString();
        const [integerPart, decimalPart] = numStr.split('.');
        const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
    }
    const handleOrderButtonClick = async () => {
        handleOrderClose();
        dispatch(fetchStockPrices(data.flatMap(category => category.productList)));
        if (!data || data.length === 0) return;
        const payload = {
          strategyId: 4,  
          totalAmount: parseFormattedNumber(inputValue),  
          productDTOList: data.flatMap(category => 
            category.productList.map(product => ({
                
              productCode: product.code,
              quantity: amounts[product.code], 
              amount: stocksPrices[product.code] || 0,  
            }))
          ),
        };
      
        try {
          const response = await fetch('/api/pickle-customer/trade', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),  // Send the payload as JSON
          });
      
          if (!response.ok) {
            throw new Error('API 요청 실패');
          }
      
          const result = await response.json();
          console.log('체결 성공:', result);
          alert("주문이 완료되었습니다.")

        } catch (error) {
          console.error('체결 요청 에러:', error.message);
        }
      };
    

    return (
        <StyledHomeContainer>
            <Header />
            <StyledHomeMainContent>
                <Sidebar />
                <StyledHomeContent>
                <SecondHeader>
                    <Previous>
                    <ArrowIcon />
                    <StrategyName>중위험 전략</StrategyName>
                    </Previous>
                    <StyledInputGroup>
                        <StyledFormControl
                            value={inputValue}
                            
                            onChange={handleChange}
                        />
                        <StyledButton variant="outline-secondary" id="button-addon2" onClick={handleShow}>
                            Apply
                        </StyledButton>
                    </StyledInputGroup>
                </SecondHeader>
                <StyledContent>
                {data && data.map((category, index) => {
                        if (category.categoryName === "국내" || category.categoryName === "해외") {
                            const categoryStockIds = category.productList.map(product => product.code);

                            return (
                                <Category key={index}>
                                    <CategoryName>{category.categoryName}</CategoryName>
                                    <StrategyBox productList={category.productList} stockIds={categoryStockIds} inputValue={parseFormattedNumber(inputValue)} 
                                    categoryRatio={category.categoryRatio}
                                    categoryName={category.categoryName}
                                    triggerHeldQuantities={triggerHeldQuantities}
                                    onPriceChange={handlePriceChange}
                                    onAmountChange={handleAmountChange}
                                    
                                    />
                                </Category>
                            );
                        }
                        return (
                            <Category key={index}>
                                <CategoryName>{category.categoryName}</CategoryName>
                                
                                <StrategyBox 
                                    productList={category.productList} 
                                    stockIds={[]} 
                                    inputValue={parseFormattedNumber(inputValue)} 
                                    categoryRatio={category.categoryRatio}
                                    categoryName={category.categoryName}
                                    triggerHeldQuantities={triggerHeldQuantities}
                                    onPriceChange={handlePriceChange}
                                    onAmountChange={handleAmountChange}
                                    
                                />
                            </Category>
                        );
                    })}
                <OrderButton  applyClicked={applyClicked} onClick={handleOrderShow} disabled={!applyClicked}>총 {formatNumber(orderResult)}원 추가 주문하기</OrderButton>
                </StyledContent>
                
                
                
            </StyledHomeContent>
            
            </StyledHomeMainContent>
            <Modal show={show} onHide={handleClose} animation={false} size="lg">
        <Modal.Header closeButton>
          
        </Modal.Header>
        <Modal.Body>{inputValue}원으로 투자할 경우, 추가 매수/매도 정보를 계산하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            취소
          </Button>
          <Button variant="primary" onClick={handleButtonClick}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={orderShow} onHide={handleOrderClose} animation={false} size="lg">
        <Modal.Header closeButton>
          
        </Modal.Header>
        <Modal.Body>정말 주문하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleOrderClose}>
            취소
          </Button>
          <Button variant="primary" onClick={handleOrderButtonClick} >
            확인
          </Button>
        </Modal.Footer>
      </Modal>
        </StyledHomeContainer>
    );
}
