"use client";
import React from "react";
import SaborScene from "scenes/sabor";
import Head from "next/head";
import { SiThreedotjs, SiBlender, SiOpengl } from "react-icons/si";
import useI18n from "locales/use-i18n";

function ProjectCard(props) {
  return <div className="challenge-card">{props.children}</div>;
}

function ProjectMedia(props) {
  return <div className="media-3d">{props.children}</div>;
}

function ProjectDetail(props) {
  return <div className="detail">{props.children}</div>;
}

export default function Sabor() {
  const i18n = useI18n();
  return (
    <ProjectCard>
      <Head>
        <title>{i18n.t("challenge.sabor.title")}</title>
      </Head>
      <ProjectMedia>
        <SaborScene />
      </ProjectMedia>
      <ProjectDetail>
        <h2>{i18n.t("challenge.sabor.title")}</h2>
        <span>
          <SiThreedotjs size="1.5em" />
          <SiBlender size="1.5em" />
          <SiOpengl size="1.5em" />
        </span>
        <p>This is a game-ready character. Rigged and animated using Blender</p>
      </ProjectDetail>
    </ProjectCard>
  );
}
