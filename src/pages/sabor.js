import React from "react";
import styled from 'styled-components';
import tw from 'twin.macro';
import SaborScene from "../scenes/sabor";
import { useTranslation, Trans } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { SiThreedotjs, SiBlender, SiOpengl } from "react-icons/si";
import Navbar from "../components/navigation-bar";
import FootNote from "../components/foot-note";

const Container = styled.div`
    ${tw`
        flex flex-col justify-start items-center gap-4
        lg:w-screen lg:h-screen
        py-10
        px-5
        bg-indigo-200 dark:bg-gray-900
        text-gray-800 dark:text-white
    `}
`;

const ProjectContainer = styled.div`
    ${tw`
        flex flex-col md:flex-row justify-center items-center
        text-center
        shadow-lg
        rounded-lg
        w-full max-w-screen-lg
        overflow-hidden
    `}
    flex-grow: 1;
    canvas {
        ${tw`
            w-full md:w-2/3 h-full
        `}
        background: radial-gradient(closest-side, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.2));
      }
`;

const DetailContainer = styled.div`
    ${tw`
        flex flex-col justify-start items-start gap-4
        text-left
        relative
        right-0
        w-full md:w-1/3 max-w-screen-md md:h-full 
        bg-indigo-100 dark:bg-gray-600
        text-gray-600 dark:text-gray-100
        object-contain
        p-4
    `}
    h2 {
        ${tw`
            font-black
            text-black dark:text-indigo-100
        `}
    }
    p, ul {
        ${tw`
            font-normal
            text-sm
        `}
    }
    small {
        ${tw`
            font-thin
            text-gray-500 dark:text-gray-300
            mb-3
        `}
    }
    & ul li {
        ${tw`
            relative
            pl-5
            before:content-["▸"]
            before:absolute
            before:left-0
        `}
    }
    span {
        ${tw`
            flex gap-2
        `}
    }
`;

export default function Sabor() {
    const { t } = useTranslation("challenge");
    return <Container>
        <Head>
            <title>{t("weapon-master.title")}</title>
        </Head>
        <Navbar />
        <ProjectContainer>
            <Head>
                <title>{t("sabor.title")}</title>
            </Head>
            <SaborScene />
            <DetailContainer>
                <h2>{t("sabor.title")}</h2>
                <span><SiThreedotjs size="1.5em" /><SiBlender size="1.5em" /><SiOpengl size="1.5em" /></span>
                <Trans i18nKey="challenge:sabor.description">
                    <p>This is a game-ready character. Rigged and animated using Blender</p>
                </Trans>
            </DetailContainer>
        </ProjectContainer>
        <FootNote />
    </Container>
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'challenge'])),
            // Will be passed to the page component as props
        },
    };
}
