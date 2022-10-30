import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../components/Header'
import letter from '../img/LetterB.png'
import { sanityClient, urlFor } from '../sanity'
import { Post } from '../typings'

interface Props {
  posts: [Post]
}

const Home = ({posts} : Props) => {
  return (
    <div className="max-w-7xl mx-auto">
      <Header/>

    <div className="flex justify-between items-center bg-green-200 border-black border py-10 lg:py-10">
      <div className="px-10 space-y-5">
        <h1 className="text-6xl max-w-xl font-serif"><span className="underline decoration-black decoration-4">Blogger</span> is a place to write, read, and connect</h1>
        <h2>It's easy amd free to post your thinking on any topic and connect with millions of readers.</h2>
      </div>
      <img src={letter.src} alt="" className="hidden md:inline-flex h-32 lg:h-80"/>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6">
      {posts.map(post => (
        <Link key={post._id} href={`post/${post.slug.current}`}>
          <div className="group overflow-hidden rounded-lg cursor-pointer">
            <img className="h-60 object-cover group-hover:scale-105 transition-all duration-300" src={
              urlFor(post.mainImage).url()!
            } alt = "" />
            <div className="flex justify-between p-5 bg-white">
              <div>
                <p>{post.title}</p>
                <p>{post.description}</p>
              </div>

              <img className="w-12 h-12 rounded-full" src={urlFor(post.author.image).url()!} alt=""/>
              </div>
          </div>
        </Link>
      ))}
    </div>
    </div>
  )
}

export default Home

export const getServerSideProps = async () => {
  const query = `* [_type == "post"] {
    _id,
    title,
    author -> {
    name,
    image
  }, 
  description,
  mainImage,
  slug
  }`;

  const posts = await sanityClient.fetch(query)

  return  {
    props : {
      posts,
    }
  }
}