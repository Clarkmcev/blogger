import { GetStaticProps } from 'next';
import React, { useState } from 'react'
import banner from '../../img/Banner.jpg'
import Header from '../../components/Header';
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings';
import PortableText, {blockContentToPlainText}  from "react-portable-text"
import { useForm, SubmitHandler  } from "react-hook-form";
// import {PortableText} from '@portabletext/react'

interface IFormInput {
    _id: string;
    name: string;
    email:string;
    comment: string;
}

interface Props {
    post: Post;
}

function Post({post}: Props) {
    console.log(post)

    const [submitted, setSubmitted] = useState(false)

    const { register, handleSubmit, formState: {errors}} = useForm();

    const onSubmit: SubmitHandler<IFormInput> = async(data) => {
        await fetch('/api/createComment', {
            method: 'POST',
            body: JSON.stringify(data),
        }).then(() => {
            console.log(data);
            setSubmitted(true)
        }).catch((err) => {
            console.log(err)
            setSubmitted(false)
        })
    }

    const components = {
        types: {
          h1: (props:any) => (
            <h1 className="text-2xl font-bold my-5" {...props}></h1>
          )
        }
      }

  return (
    <div>
        <Header/>

        <img src={banner.src} alt="" className="w-full h-20 mx-auto p-5" />
        {/* <img src={post.mainImage} alt="" className="w-full h-20 mx-auto p-5" /> */}
        <article className="max-w-3xl mx-auto p-5">
            <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
            <h2 className="text-xl font-light text-gray-500">{post.description}</h2>
            <div className="flex items-center space-x-2 py-2">
                <img className="w-10 h-10 rounded-full" src={urlFor(post.author.image).url()!} alt="" />
                <p className="font-extralight text-sm">Blog post by <span className="text-green-600">{post.author.name}</span> - Published at {new Date(post._createdAt).toLocaleDateString()}</p>
            </div>
            <div>
                {/* <PortableText
                 dataset=  {process.env.NEXT_PUBLIC_SANITY_DATASET!}
                 projectId= {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
                 content={post.body}
                 serializers={
                    {
                    br: (props:any) => (
                        <div {...props}></div>
                    ),
                    h1: (props:any) => (
                        <h1 className="text-2xl font-bold my-5" {...props}/>
                    ),
                    h2: (props: any) => (
                        <h2 className="text-xl font-bold my-5" {...props}/>
                    ),
                    li: ({children}: any) => (
                        <li className="ml-4 list-disc">{children}</li>
                    ),
                    link: ({href, children}: any) => (
                        <a href={href}  className="text-blue-500 hover:underline">{children}</a>
                    )
                }
                 }
                /> */}
                <hr className="max-w-lg my-5 mx-auto border border-green-600"></hr>

                {submitted ? 
                
                <div className="flex flex-col p-10 my-10 bg-green-300 rounded text-white max-w-2xl mx-auto">
                    <h3 className="text-3xl font-bold">Thanks you for submitting!</h3>
                    <p>Once it has been approved, it will appear below.</p>
                </div> :
            

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-5 my-10 m-w-2xl mx-auto mb-10" >
            <h3 className="text-sm text-green-600">Enjoyed this article?</h3>
                <h4 className="text-3xl font-bold py-2">Leave a comment below!</h4> 
                <hr className="py mt-2"/>

                <input {...register("_id")} type="hidden" name="_id" value={post._id}/>

                <label className="block mb-5">
                    <span className="text-gray-700">Name</span>
                    <input {...register("name", { required: true})} className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-green-600 outline-none ring-0 focus:ring-1" placeholder="Fake Name" type="text"></input>
                </label>
                <label className="block mb-5">
                    <span className="text-gray-700">Email</span>
                    <input {...register("email", { required: true})} className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-green-600 outline-none ring-0 focus:ring-1" placeholder="Fake Name" type="text"></input>
                </label>
                <label className="block mb-5">
                    <span className="text-gray-700">Comment</span>
                    <textarea {...register("comment", { required: true})} className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-green-600 outline-none ring-0 focus:ring-1 " placeholder="Fake Name" rows={8}></textarea>
                </label>

                <div className="flex flex-col p-5">
                {errors.name && (
                    <span className="text-red-500">A name is required</span>
                )}
                {errors.email && (
                    <span className="text-red-500">An email is required</span>
                )}
                {errors.comment && (
                    <span className="text-red-500">A comment is required</span>
                )}
                </div>
                <input type="submit" className="bg-green-600 shadow hover:bg-green-400 px-4 py-2 rounded cursor-pointer" />
            </form>}

            <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-green-600 space-y-2">
                <h3 className="text-4xl">Comments</h3>
                <hr className="pb--2"/>
                    {post.comments.map((comment) => (
                        <div key={comment._id}>
                            <p><span className="text-green-600">{comment.name}</span> : {comment.comment}</p>
                        </div>
                    ))}
            </div>
            </div>
        </article>
    </div>
  )
}

export default Post;

export const getStaticPaths = async () => {
    const query = `* [_type == "post"] {
        _id,
          slug {
          current
        }
        }`

    const posts = await sanityClient.fetch(query)

    const paths = posts.map((post: Post) => ({
        params: {
            slug: post.slug.current
        }
    }))

    return {
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {

    const query = `
    * [_type == "post" && slug.current == $slug][0] {
    _id,
      _createdAt,
      title,
      author -> {
      name,
      image
    },
    'comments': *[
        _type == "comment" &&
        post._ref == ^._id &&
        approved == true],
    description,
    maineImage,
    slug,
    body
    }`

    const post = await sanityClient.fetch(query, {
        slug: params?.slug,
    })

    if (!post) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            post,
        },
        revalidate: 60, // Update the cache, new versioning after 60sec
    }
}