import React, { useEffect, useState } from "react";
import {
  StyledConsultSide,
  StyledConsultBox,
  StyledConsultContainer,
  StyledConsultContentBox,
  StyledLeftContent,
  HighlightBox,
  LinkWrapper,
  StyledBacktestHeader,
  StyledLeftDiv,
  LegendDiv,
  LegendListDiv,
  GraphWithLegendContainer,
  StockTableContainer,
  CategoryInfo,
  ColorCircle,
  Bolder,
  CategoryInfoContainer,
  AlertContainer,
  ProductInput,
  ProductInputButton,
  CreateStrategyBtn,
} from "./BacktestPage.style";
import { Link, useLocation, useNavigate } from "react-router-dom";
import profile from "/assets/backtest-profile.svg";
import { Button, InputGroup, Form, Modal } from "react-bootstrap";
import Circular from "../../components/common/circular-graph/Circular";
import BacktestChart from "../../components/common/backtest/BacktestChart";
import RunBacktestButton from "../../components/common/backtest/RunBacktestButton";
import EditableLegend from "../../components/common/editable-legend/EditableLegend";
import { useSelector, useDispatch } from "react-redux";
import {
  addProductInSelectedCategory,
  clearData,
  selectCategory,
  setThemeList,
} from "../../store/reducers/strategy";
import EditableStockTable from "../../components/common/editable-stock-table/EditableStockTable";
import { BsSearch } from "react-icons/bs";
import SearchModal from "../../components/consult/search-modal/SearchModal";
import { createStrategy, readThemeList } from "../../api/commonApi";
import SubmitStrategyModal from "../../components/consult/submit-strategy-modal/SubmitStrategyModal";
import axios from "axios";

export default function BacktestPage() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [activeSearchModal, setActiveSearchModal] = useState(false);

  const navigate = useNavigate();

  const data = useSelector((state) => state.strategy.data);

  const isValidCategoryRatio = useSelector(
    (state) => state.strategy.isValidCategoryRatio
  );

  const handleClick = (index) => {
    console.log(index);
    setSelectedIndex(index === selectedIndex ? null : index);
  };

  const dispatch = useDispatch();

  const selectedCategoryProduct = useSelector((state) => {
    let curCategory;
    state.strategy.data.map((category) => {
      if (category.selected) {
        curCategory = category;
      }
    });
    return curCategory;
  });

  // TODO 상담방에 입장할 고객 이름
  const cusName = "박찬란";

  const handleClickLegend = (category) => {
    dispatch(
      selectCategory({
        categoryId: category.id,
      })
    );
  };

  const location = useLocation();

  useEffect(() => {
    // 경로가 '/consult/backtest'에서 벗어날 때 상태 초기화
    if (!location.pathname.startsWith("/consult/backtest")) {
      dispatch(clearData());
    }
  }, [location, dispatch]);

  useEffect(() => {
    const fetchThemeList = async () => {
      const response = await readThemeList();
      console.log(response.data.categories);
      dispatch(setThemeList({ categories: response.data.categories }));
    };

    fetchThemeList();

    return () => {};
  }, []);

  const userId = useSelector((state) => state.pbuser.id);
  const token = useSelector(state => state.pbuser.token);
  const submitStrategy = async () => {
    // console.log(data);
    const categoryList = data
      .filter((category) => {
        console.log();
        return 0 < Number(category.value);
      })
      .map((category) => {
        const productList = category.productList.map((product) => {
          return {
            ...product,
            ratio: Number(product.ratio) / 100,
          };
        });
        return {
          category: category.id,
          categoryRatio: Number(category.value) / 100,
          productList: productList,
        };
      });

    console.log(categoryList);

    await axios
      .post("/api/pickle-common/strategy", {
        pbId: userId,
        // pbId: 1,
        customerId: 1,
        consultingHistoryId: 1,
        name: "상담기록 연결하고 테스트3",
        categoryList: categoryList,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        alert("전략 생성에 성공하였습니다!");
        navigate("/homepage");
      })
      .catch((e) => {
        alert("한번 더 시도해 주십시오");
      });
  };

  return (
    <>
      <StyledConsultContainer>
        <StyledConsultBox>
          <StyledConsultSide>
            {[
              { text: "전략 생성", link: "/consult/backtest" },
              { text: "마이데이터", link: "/consult/backtest/mydata" },
              // { text: "전략 생성", link: "/consult/backtest/strategy" },
            ].map((item, index) => (
              <LinkWrapper key={index} onClick={() => handleClick(index)}>
                <HighlightBox visible={selectedIndex === index} />
                <Link
                  to={item.link}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div>{item.text}</div>
                </Link>
              </LinkWrapper>
            ))}
          </StyledConsultSide>
          <StyledLeftContent>
            <StyledBacktestHeader>
              <section className="user">
                <img src={profile}></img>
                {cusName} 고객님
              </section>
              <Button variant="light">프리셋 불러오기</Button>
            </StyledBacktestHeader>
            <StyledLeftDiv>
              <section className="Top">
                <GraphWithLegendContainer>
                  <Circular
                    data={data}
                    top={"20%"}
                    left={"-5%"}
                    width={"350px"}
                    height={"250px"}
                  />
                  <LegendDiv>
                    <LegendListDiv>
                      {data.map((category) => (
                        <span
                          onClick={() => handleClickLegend(category)}
                          key={category.label}
                        >
                          <EditableLegend category={category} />
                        </span>
                      ))}
                    </LegendListDiv>
                  </LegendDiv>
                  {!isValidCategoryRatio && (
                    <AlertContainer>비율 합은 100이여야 합니다.</AlertContainer>
                  )}
                </GraphWithLegendContainer>
              </section>
              <StockTableContainer>
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <CategoryInfoContainer>
                    <ColorCircle
                      color={selectedCategoryProduct.color}
                    ></ColorCircle>
                    <CategoryInfo>
                      <Bolder>{selectedCategoryProduct.id}</Bolder> 종목 구성
                    </CategoryInfo>
                  </CategoryInfoContainer>
                  {/* 예시용 input임 */}
                  <div onClick={() => setActiveSearchModal(true)}>
                    <ProductInput placeholder="종목명 입력" />
                    <ProductInputButton>
                      <BsSearch
                        color="white"
                        style={{ transform: "translateY(-2px)" }}
                      />
                    </ProductInputButton>
                  </div>
                </div>
                <EditableStockTable
                  category={selectedCategoryProduct}
                  productList={selectedCategoryProduct.productList}
                  width={`90%`}
                />
              </StockTableContainer>
              <section className="Bottom"></section>
              <section className="footer" style={{ position: "relative" }}>
                <CreateStrategyBtn
                  onClick={() => {
                    console.log("전략확정!");
                    submitStrategy();
                  }}
                >
                  전략 확정
                </CreateStrategyBtn>
              </section>
            </StyledLeftDiv>
          </StyledLeftContent>
          <StyledConsultContentBox>
            <BacktestChart width={"90%"}></BacktestChart>
          </StyledConsultContentBox>
        </StyledConsultBox>
      </StyledConsultContainer>
      {activeSearchModal && (
        <SearchModal
          activeSearchModal={activeSearchModal}
          setActiveSearchModal={setActiveSearchModal}
        />
      )}
      <SubmitStrategyModal />
    </>
  );
}
