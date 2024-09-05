import React from "react";
import Header from "../../../components/common/header/Header";
import Sidebar from "../../../components/common/sidebar/Sidebar";
import { StyledHomeContainer, StyledHomeMainContent, StyledHomeContent, StyledHead2Text, StyledContentBlock } from "../../Homepage/HomePage.style";

export default function Preset() {
    

    return (

        <StyledHomeContainer>
            <Header/>
            <StyledHomeMainContent>                
                <Sidebar/>
        <StyledHomeContent style={{padding: "40px"}}>
            <StyledHead2Text>
                내가 만든 프리셋
            </StyledHead2Text>
            <StyledContentBlock></StyledContentBlock>
        </StyledHomeContent>
        </StyledHomeMainContent>
        </StyledHomeContainer>
    )
}
