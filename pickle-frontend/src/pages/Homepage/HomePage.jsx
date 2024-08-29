import React from "react";
import Header from "../../components/common/header/Header";
import Sidebar from "../../components/common/sidebar/Sidebar";
import AllMoney from "../../components/common/mydata/allmoney/AllMoney";
import WalletCard from "../../components/common/wallet-card/WalletCard";
import { StyledS1Text, StyledHomeContainer, StyledHomeContent, StyledHomeMainContent, StyledHeadText, StyledHomeSection, StyledContentBlock, StyledHead2Text, StyledPbCard } from "./HomePage.style";

export default function HomePage(){    
    
    //TODO
    const loginUserName = "홍길동";
    const consultPB = "윤재욱";
    const consultReqNum = 3;

    const now = new Date();
    const consultDate = new Date(); //!! 상담일자로 변경해야 함
    consultDate.setDate(consultDate.getDate()-2);
    const Dday = Math.floor((now - consultDate) / (1000 * 60 * 60 * 24));
    
    const dateString = consultDate.toLocaleDateString();
    const timeString = consultDate.toLocaleTimeString();
    const [consultYear, consultMonth, consultDay] = dateString.split('.');
    const [consultHour, consultMin, consultSec] = timeString.split(':');


    //내 자산 지갑
    const walletTexts = ["내 포트폴리오 자산", "총 자산", "투자 여유 금액"]
    const walletAmounts = [7532220, 254032350, 12321200]

    return (
        <StyledHomeContainer>
            <Header />
            <StyledHomeMainContent>
                    <Sidebar />
                <StyledHomeContent>

                    {/* section 1 */}
                    <StyledHomeSection> 
                    <StyledHeadText>
                        {loginUserName.slice(1)}님, 환영합니다.
                    </StyledHeadText>
                        <article>
                        <StyledContentBlock>
                            <StyledS1Text>
                                <img src="/assets/home-bell.svg"></img>
                                <span><p>예정된 상담 일정</p><hr></hr></span>
                                <p style={{fontWeight:"700"}}>D-{Dday}</p>
                                <section>
                                    <p>{consultYear}년 {consultMonth}월 {consultDay}일</p>
                                    <p>{consultHour}시 {consultMin}분</p>
                                    <p>{consultPB}PB</p>
                                </section>
                                <img src="/assets/home-next.svg"></img>
                            </StyledS1Text>
                        </StyledContentBlock>
                        <StyledContentBlock>
                            <StyledS1Text>
                                    <p>내가 보낸 요청</p>
                                    <span><p>{consultReqNum}건</p></span>                               
                                    <img src="/assets/home-next.svg" style={{marginLeft:"8px"}}></img>
                            </StyledS1Text>
                        </StyledContentBlock>
                        </article>
                    </StyledHomeSection>

                    {/* section 2 */}
                    <StyledHomeSection>
                    <StyledHead2Text>
                     나의 투자 현황을 살펴보세요.
                    </StyledHead2Text>
                    <WalletCard texts={walletTexts} amounts={walletAmounts} />
                    </StyledHomeSection>

                    
                    {/* section 3 */}
                    <StyledHomeSection> 
                    <StyledHead2Text>
                    믿을 수 있는 PB를 만나보세요.
                    </StyledHead2Text>
                    <StyledPbCard>
                        <p>
                        ETF잘알<br/>
                        PB
                        </p>
                        <img src="/assets/home-pb1.svg"></img>
                    </StyledPbCard>
                    </StyledHomeSection>
                </StyledHomeContent>
            </StyledHomeMainContent>
        </StyledHomeContainer>
    )
};