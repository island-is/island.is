import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import ContentWrapper from '../components/Layout/ContentWrapper';
import Nav from '../components/Layout/Nav';

export default function Home() {
  return (
    <ContentWrapper>
      <div className="home">
        <div className="home__info">
          Here comes a description about the site .. Lorem ipsum dolor sit amet,
          consectetur adipisicing elit. Modi animi officiis ullam perferendis
          blanditiis rerum ex sapiente laborum facere eaque. Excepturi sunt
          tempore ex ducimus nulla repudiandae voluptatum, nam veniam.
        </div>
        <div className="home__shortcuts">
          <div className="home__shortcuts__item">
            <div className="home__shortcuts__item__description">
              Do you not have access?
            </div>
            <div className="home__shortcuts__item__link">
              <a href="TODO:">Get access</a>
            </div>
          </div>
          <div className="home__shortcuts__item">
            <div className="home__shortcuts__item__description">
              Do you need help? Check out the help pages
            </div>
            <div className="home__shortcuts__item__link">
              <a href="TODO:">Help pages</a>
            </div>
          </div>
          <div className="home__shortcuts__item">
            <div className="home__shortcuts__item__description">
              Shortcut to create a client
            </div>
            <div className="home__shortcuts__item__link">
              <Link href="/client">
                <a>Create a new client</a>
              </Link>
            </div>
          </div>

          <div className="home__shortcuts__item">
            <div className="home__shortcuts__item__description">
              Shortcut to create an API Resource
            </div>
            <div className="home__shortcuts__item__link">
              <Link href="/api-resource">
                <a>Create a new client</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
}
